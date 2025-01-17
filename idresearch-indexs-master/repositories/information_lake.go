package repositories

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"io/ioutil"
	"log"
	"math/rand"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/gojek/heimdall/v7/httpclient"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type InformationLakeRepository struct {
	db            *gorm.DB
	scopusApiHost string
	scopusApiKey1 string
	scopusApiKey2 string
}

func NewInformationRepository(db *gorm.DB, scopusApiHost, scopusApiKey1, scopusApiKey2 string) domains.IinformationLakeRepository {
	return &InformationLakeRepository{
		db:            db,
		scopusApiHost: scopusApiHost,
		scopusApiKey1: scopusApiKey1,
		scopusApiKey2: scopusApiKey2,
	}
}

func (r *InformationLakeRepository) IngestInformation(ctx context.Context, info domains.InformationLake) error {
	return r.db.WithContext(ctx).Table("information_lake").Create(&info).Error
}

func (r *InformationLakeRepository) countInformationDataByDaerah(ctx context.Context, daerahLevel, daerahCode int, filter domains.InformationDataFilter) (total int64, err error) {
	query := r.db.WithContext(ctx).Table("information_lake")
	if !filter.AnyYears {
		query.Where("year BETWEEN ? AND ?", filter.YearStart, filter.YearEnd)
	}
	if !filter.AnyTopic {
		query.Where("topik_id", filter.TopicID)
	}
	if filter.Keyword != "" {

		query.Where("reverse(information_lake.title) @@ (reverse(?) || ':*')::tsquery", filter.Keyword)
	}
	if filter.DataSource != "all" {
		query.Where("source", filter.DataSource)
	}

	if daerahCode != 0 {
		query.Where("daerah_code::text LIKE ?", strconv.Itoa(daerahCode)+"%")
	}
	err = query.Count(&total).Error
	return
}

func (r *InformationLakeRepository) GetInformationDataByDaerah(ctx context.Context, daerahLevel, daerahCode, offset, limit int, filter domains.InformationDataFilter) (total int64, informations []domains.InformationLake, err error) {

	fmt.Println("KEYWORD", filter.Keyword)
	query := r.db.Debug().WithContext(ctx).Table("information_lake").Select("information_lake.*, topic.name AS topic_name")
	if !filter.AnyYears {
		query.Where("year BETWEEN ? AND ?", filter.YearStart, filter.YearEnd)
	}
	if !filter.AnyTopic {
		query.Where("topik_id", filter.TopicID)
	}

	if filter.Keyword != "" {
		if len(strings.Split(filter.Keyword, " ")) > 1 {
			filter.Keyword = strings.ReplaceAll(filter.Keyword, " ", " >-< ")
		}
		query.Where("reverse(information_lake.title) @@ (reverse(?) || ':*')::tsquery", filter.Keyword)
	}
	if filter.DataSource != "all" {
		query.Where("source", filter.DataSource)
	}

	fmt.Println("DAERAH CODE", daerahCode)

	if daerahCode != 0 {
		query.Where("daerah_code::text LIKE ?", strconv.Itoa(daerahCode)+"%").
			Joins("LEFT JOIN topic ON topic.id = information_lake.topik_id")
	} else {
		query.Joins("LEFT JOIN topic ON topic.id = information_lake.topik_id")

	}

	err = query.Offset(offset).Limit(limit).Order("source ASC").Find(&informations).Error
	if err != nil {
		return
	}

	total, err = r.countInformationDataByDaerah(ctx, daerahLevel, daerahCode, filter)
	log.Println("total found", total)
	return
}

func (r *InformationLakeRepository) GetInformationDataFromScopusAPI(ctx context.Context, daerahLevel int, daerahLabel string) (informations []domains.InformationLake, err error) {
	rand.Seed(time.Now().UnixMilli())
	keyIndex := rand.Intn(100)

	keyConfigLabel := r.scopusApiKey1
	if keyIndex%2 == 0 {
		keyConfigLabel = r.scopusApiKey2
	}

	var scopusDatas domains.ScopusSearchResult
	timeout := 2 * time.Minute
	client := httpclient.NewClient(httpclient.WithHTTPTimeout(timeout))
	urlEncoded := fmt.Sprintf(
		"%s/content/search/scopus?query=title(%s)&apiKey=%s",
		r.scopusApiHost,
		url.QueryEscape(daerahLabel),
		keyConfigLabel,
	)
	res, err := client.Get(urlEncoded, nil)

	body, err := ioutil.ReadAll(res.Body)
	err = json.Unmarshal(body, &scopusDatas)

	if len(scopusDatas.SearchResults.Entry) <= 1 {
		err = errors.New("SCOPUS NOT FOUND")
	}

	for _, v := range scopusDatas.SearchResults.Entry {
		fmt.Println(v.DcTitle)
		year, errYear := strconv.Atoi(strings.Split(v.PrismCoverDate, "-")[0])
		if errYear != nil {
			year = 0
		}

		links := []string{}
		for _, v := range v.Link {
			if v.Ref == "scopus" {
				links = append(links, v.Href)
			}
		}

		informations = append(informations, domains.InformationLake{
			Title:       v.DcTitle,
			Description: v.PrismPublicationName + " | " + v.PrismAggregationType + " | doi : " + v.PrismDoi,
			Author:      v.DcCreator,
			Year:        year,
			Source:      "scopus",
			Links:       links,
		})
	}

	return
}

func (r *InformationLakeRepository) AddCountInformationData(ctx context.Context, info domains.InformationLake) error {

	var totalNow domains.TotalCollectedData
	errStats := r.db.WithContext(ctx).Raw("SELECT SUM(total_informations) AS total FROM topic").First(&totalNow).Error
	if errStats == nil {
		r.db.WithContext(ctx).Exec("INSERT INTO time_series (collected_at, key, value) VALUES (?,?,?)", time.Now(), "scraper_collected", fmt.Sprintf(`{"total":%d}`, totalNow.Total))
	}
	info.Stats.LastIngestTime = time.Now()
	r.db.WithContext(ctx).Table("scrapers").Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "label"}},
		DoUpdates: clause.AssignmentColumns([]string{"agent_ip", "last_ingest_time", "data_collected", "tail_log"}),
	}).Create(&info.Stats)

	// topic
	err := r.db.WithContext(ctx).Exec("UPDATE topic SET total_informations=total_informations+1 WHERE id = ?", info.TopikID).Error
	if err != nil {
		return err
	}
	// daerah
	err = r.db.WithContext(ctx).Exec(fmt.Sprintf("UPDATE %s SET total_informations = total_informations+1 WHERE %s_code = ? ", common.DaerahLevel[info.DaerahLevel], common.DaerahLevel[info.DaerahLevel]), info.DaerahCode).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *InformationLakeRepository) GetAllInformationLake(ctx context.Context, offset, limin int64, keyword string) (literatures []domains.InformationLake, err error) {
	q := r.db.WithContext(ctx).Table("information_lake").
		Select("information_lake.*, topic.name AS topic_name")

	if keyword != "" {
		q.Where("title ILIKE ?", "%"+keyword+"%")
	}
	q.Joins("JOIN topic ON information_lake.topik_id = topic.id")
	err = q.Limit(int(limin)).Offset(int(offset)).Order("created_at DESC").Find(&literatures).Error

	return
}
func (r *InformationLakeRepository) GetTotalInformationLake(ctx context.Context, keyword string) (total int64, err error) {
	q := r.db.WithContext(ctx).Table("information_lake")

	if keyword != "" {
		q.Where("title ILIKE ?", "%"+keyword+"%")
	}
	err = q.Count(&total).Error
	return

}

func (r *InformationLakeRepository) Delete(ctx context.Context, id string) (err error) {
	err = r.db.WithContext(ctx).Table("information_lake").Where("id", id).Delete(&domains.InformationLake{}).Error
	return
}

func (r *InformationLakeRepository) UpdateTopicToUndefined(ctx context.Context, topicID string) (err error) {

	err = r.db.WithContext(ctx).Table("information_lake").Where("topik_id", topicID).Update("topik_id", "00000000-0000-0000-0000-000000000000").Error
	return

}

func (r *InformationLakeRepository) GetSourceLiteraturesStats(ctx context.Context) (stats []domains.SourceLiterature, err error) {
	err = r.db.WithContext(ctx).Raw("SELECT count(source) as total, source as name FROM information_lake GROUP BY source").Find(&stats).Error
	return
}

func (r *InformationLakeRepository) GetScrapedStats(ctx context.Context) (stats domains.ScrapedStats, err error) {

	err = r.db.WithContext(ctx).Raw("SELECT (46280) AS daerah, (SELECT count(*) FROM information_lake) AS scraped, (SELECT count(*) FROM topic)  AS topic").Find(&stats).Error
	return
}

func (r *InformationLakeRepository) GetKeywordRecommendation(ctx context.Context, keyword string) (result []domains.SearchListKeyword, err error) {
	if len(strings.Split(keyword, " ")) > 1 {
		keyword = strings.ReplaceAll(keyword, " ", " >-< ")
	}
	err = r.db.WithContext(ctx).Table("information_lake").Raw(`
		SELECT count(*) AS total, label FROM (SELECT lower(reverse(rm[1])) AS label
            FROM (SELECT ts_headline(
                reverse(title),
                (reverse(?) || ':*')::tsquery
            ) AS label
        FROM information_lake WHERE reverse(title) @@ (reverse(?) || ':*')::tsquery) AS t(s) 
		CROSS JOIN LATERAL regexp_matches(s, '<b>(.*?)</b>', 'g') AS rm(matches)) x 
		GROUP BY label ORDER BY total DESC`, keyword, keyword).Find(&result).Error
	return
}

func (r *InformationLakeRepository) GetGeojson(ctx context.Context, daerahLevel, daerahCode int) (result []domains.Provinsis, err error) {
	daerahLevelTable := []string{"", "provinsi", "kabupaten", "kecamatan", "desa"}
	err = r.db.Debug().WithContext(ctx).Table(daerahLevelTable[daerahLevel]).Select("ST_AsGeoJSON(geoarea) AS area").Where(fmt.Sprintf("%s_code", daerahLevelTable[daerahLevel]), daerahCode).Find(&result).Error
	if err != nil {
		return
	}
	return
}

func (r *InformationLakeRepository) GetDaerahRecommendation(ctx context.Context, keyword string) (result []domains.SearchListDaerah, err error) {

	formatedKeyword := "%" + keyword + "%"

	var provinsis []domains.SearchListDaerah
	err = r.db.WithContext(ctx).Debug().Table("provinsi").Raw("SELECT label, provinsi_code AS daerah_code, '1' AS daerah_level FROM provinsi WHERE label ILIKE ? GROUP BY provinsi_code, label, daerah_level", formatedKeyword).Find(&provinsis).Error
	if err != nil {
		return
	}
	result = append(result, provinsis...)

	var kabupatens []domains.SearchListDaerah
	err = r.db.WithContext(ctx).Table("kabupaten").Raw("SELECT label, kabupaten_code AS daerah_code, '2' AS daerah_level FROM kabupaten WHERE label ILIKE ? GROUP BY kabupaten_code, label, daerah_level", formatedKeyword).Find(&kabupatens).Error
	if err != nil {
		return
	}
	result = append(result, kabupatens...)

	var kecamatans []domains.SearchListDaerah
	err = r.db.WithContext(ctx).Table("kecamatan").Raw("SELECT label, kecamatan_code  AS daerah_code, '3' AS daerah_level FROM kecamatan WHERE label ILIKE ? GROUP BY kecamatan_code, label, daerah_level", formatedKeyword).Find(&kecamatans).Error
	if err != nil {
		return
	}
	result = append(result, kecamatans...)

	var desas []domains.SearchListDaerah
	err = r.db.WithContext(ctx).Table("desa").Raw("SELECT concat('(Desa) ', label, ', ', description) AS label, desa_code  AS daerah_code, '4' AS daerah_level FROM desa WHERE label ILIKE ? GROUP BY desa_code, label, daerah_level, description", formatedKeyword).Find(&desas).Error
	if err != nil {
		return
	}
	result = append(result, desas...)

	return
}

func (r *InformationLakeRepository) GetInformationLakeByID(ctx context.Context, articleId string) (result domains.InformationLake, err error) {
	err = r.db.WithContext(ctx).Table("information_lake").Where("id", articleId).First(&result).Error
	return
}

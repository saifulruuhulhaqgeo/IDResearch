package repositories

import (
	"context"
	"encoding/json"
	"fmt"
	"idresearch-web/domains"
	"log"
	"strings"

	"gorm.io/gorm"
)

type ProvinsiDataRepository struct {
	db *gorm.DB
}

func NewProvinsiDataRepository(db *gorm.DB) domains.IProvinsiDataRepository {
	return &ProvinsiDataRepository{
		db,
	}
}

func (r *ProvinsiDataRepository) GetProvinsiStats(ctx context.Context) (provinsis []domains.Provinsis, ere error) {

	ere = r.db.WithContext(ctx).Raw("SELECT label, (total_provinsi + total_kabupaten + total_kecamatan) AS total_informations FROM (SELECT provinsi.label, provinsi.total_informations as total_provinsi, (SELECT SUM(x.total_informations) FROM (SELECT * FROM kabupaten GROUP BY kabupaten.kabupaten_code, kabupaten.id) x WHERE x.provinsi_code = provinsi.provinsi_code) as total_kabupaten, (SELECT SUM(x.total_informations) FROM (SELECT * FROM kecamatan GROUP BY kecamatan.kecamatan_code, kecamatan.id) x WHERE x.provinsi_code = provinsi.provinsi_code) as total_kecamatan FROM provinsi) y").Find(&provinsis).Error
	return
}

func (r *ProvinsiDataRepository) GetAllProvinsiGeoJSON(ctx context.Context, bound domains.Bounds, topicId, keyword string) (domains.GeoJSONFeatureCollection, error) {
	var provinsis []domains.Provinsis

	subQ := " "

	if topicId != "" {
		subQ += " WHERE "

		subQ += fmt.Sprintf(" information_lake.topik_id = '%s'", topicId)
	}

	if keyword != "" {
		//subQ += " AND information_lake.title ILIKE '%" + keyword + "%'"

		if topicId != "" {
			subQ += " AND "
		} else {
			subQ += " WHERE "
		}

		if len(strings.Split(keyword, " ")) > 1 {
			keyword = strings.ReplaceAll(keyword, " ", " >-< ")
		}
		subQ += fmt.Sprintf(" reverse(information_lake.title) @@ (reverse('%s') || ':*')::tsquery", keyword)
	}

	query := r.db.WithContext(ctx).Debug().Table("provinsi").
		Raw(fmt.Sprintf(`
SELECT id, provinsi.provinsi_code, st_asgeojson(geoarea) area, label, description, 0 total_informations, x.total self_total_information FROM provinsi FULL OUTER JOIN
(SELECT count(information_lake.daerah_code) total, substr(information_lake.daerah_code::text,0,3)::int daerah_code FROM information_lake
	%s
GROUP BY substr(information_lake.daerah_code::text,0,3))
x
ON x.daerah_code = provinsi.provinsi_code WHERE provinsi.geoarea && ST_MakeEnvelope(?, ?, ?, ?,  4326)
		`, subQ), bound.West, bound.South, bound.East, bound.North)
	query.Find(&provinsis)

	var geojonFeaturesCollection domains.GeoJSONFeatureCollection
	geojonFeaturesCollection.Type = "FeatureCollection"
	for _, v := range provinsis {
		properties := map[string]any{
			"fid":                     v.ID,
			"label":                   v.Label,
			"description":             v.Description,
			"total_informations":      v.TotalInformation,
			"self_total_informations": v.SelfTotalInformation,
			"code":                    v.ProvinsiCode,
			"level":                   1,
		}

		var geometry map[string]any
		err := json.Unmarshal([]byte(v.Geom), &geometry)
		if err == nil {
			geojonFeaturesCollection.Features = append(geojonFeaturesCollection.Features, domains.Feature{
				Type:        "Feature",
				Properties:  properties,
				Coordinates: geometry,
			})
		}

	}
	log.Println("Total features", len(geojonFeaturesCollection.Features))
	return geojonFeaturesCollection, query.Error
}

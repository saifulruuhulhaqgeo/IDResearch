package repositories

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"idresearch-web/domains"
	"io/ioutil"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/gojek/heimdall/v7/httpclient"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type NewsDataRepository struct {
	db             *gorm.DB
	googleNewsHost string
}

func NewNewsDataRepository(db *gorm.DB, googleNewsHost string) domains.INewsDataRepository {
	return &NewsDataRepository{
		db,
		googleNewsHost,
	}
}

func (r *NewsDataRepository) AddGoogleNewsCache(ctx context.Context, daerah string, news []domains.GoogleNews) (err error) {
	key := fmt.Sprintf("google_%s", strings.ReplaceAll(daerah, " ", ""))

	val, err := json.Marshal(news)
	if err != nil {
		return err
	}
	err = r.db.WithContext(ctx).Table("kv_cache").Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "key"}},
		DoUpdates: clause.AssignmentColumns([]string{"key", "value", "created_at"}),
	}).Create(&domains.KVCache{
		Key:       key,
		Value:     string(val),
		CreatedAt: time.Now().UTC(),
	}).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *NewsDataRepository) GetGoogleNewsCache(ctx context.Context, daerah string) (exist bool, news []domains.GoogleNews, err error) {
	var kvData domains.KVCache
	key := fmt.Sprintf("google_%s", strings.ReplaceAll(daerah, " ", ""))

	err = r.db.WithContext(ctx).Table("kv_cache").Where("key", key).First(&kvData).Error
	if err != nil {
		exist = false
		return
	}
	if kvData.CreatedAt.UTC().Unix() < time.Now().UTC().Add(-1*time.Hour).Unix() {
		exist = false
		return
	}

	err = json.Unmarshal([]byte(kvData.Value), &news)
	exist = true
	return
}

func (r *NewsDataRepository) GetGoogleNewsFromDaerah(ctx context.Context, daerah string) (news []domains.GoogleNews, err error) {

	exist, cachedNews, err := r.GetGoogleNewsCache(ctx, daerah)

	if exist {
		news = cachedNews
		return
	}
	if err != nil && err.Error() != "record not found" {
		return
	}

	bodyReq := fmt.Sprintf(`{"search":"%s"}`, url.QueryEscape(daerah))
	timeout := 2 * time.Minute
	client := httpclient.NewClient(httpclient.WithHTTPTimeout(timeout))
	url := fmt.Sprintf("%s", r.googleNewsHost)
	log.Println(url)

	res, err := client.Post(url, bytes.NewBufferString(bodyReq), nil)
	body, err := ioutil.ReadAll(res.Body)
	err = json.Unmarshal(body, &news)

	err = r.AddGoogleNewsCache(ctx, daerah, news)
	if err != nil {
		return
	}
	return
}

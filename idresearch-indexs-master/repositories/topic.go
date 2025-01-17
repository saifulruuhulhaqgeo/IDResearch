package repositories

import (
	"context"
	"fmt"
	"idresearch-web/domains"

	"gorm.io/gorm"
)

type TopicRepository struct {
	db *gorm.DB
}

func NewTopicRepository(db *gorm.DB) domains.ITopicDataRepository {
	return &TopicRepository{
		db,
	}
}

func (r *TopicRepository) GetAllTopic(ctx context.Context, daerahCode int) (topics []domains.Topic, err error) {
	stmt := r.db.Debug().WithContext(ctx).Table("information_lake").
		Select("count(information_lake.id) AS total_informations, topic.name").
		Joins("JOIN topic ON topic.id = information_lake.topik_id").
		Group("topik_id, topic.name")

	if daerahCode != 0 {
		stmt.Where("cast(daerah_code as text) LIKE ?", fmt.Sprintf("%d%%", daerahCode))
	}

	err = stmt.Find(&topics).Error
	return
}

func (r *TopicRepository) GetAllTopicTable(ctx context.Context, offset, limit int64, keyword string) (topics []domains.Topic, err error) {
	q := r.db.WithContext(ctx).Table("topic")

	if keyword != "" {
		q.Where("name ILIKE ?", "%"+keyword+"%")
	}
	q.Where("id != ?", "00000000-0000-0000-0000-000000000000")

	err = q.Limit(int(limit)).Offset(int(offset)).Order("created_at DESC").Find(&topics).Error
	return
}
func (r *TopicRepository) GetTotalTopicTable(ctx context.Context, keyword string) (total int64, err error) {
	q := r.db.WithContext(ctx).Table("topic")

	if keyword != "" {
		q.Where("name ILIKE ?", "%"+keyword+"%")
	}
	q.Where("id != ?", "00000000-0000-0000-0000-000000000000")

	err = q.Count(&total).Error

	return
}
func (r *TopicRepository) CreateTopic(ctx context.Context, topic domains.Topic) (err error) {
	err = r.db.WithContext(ctx).Table("topic").Create(&topic).Error
	return
}
func (r *TopicRepository) UpdateTopic(ctx context.Context, topic domains.Topic) (err error) {
	err = r.db.WithContext(ctx).Table("topic").Updates(&topic).Error
	return
}
func (r *TopicRepository) Delete(ctx context.Context, id string) (err error) {
	err = r.db.WithContext(ctx).Table("topic").Where("id", id).Delete(&domains.Topic{}).Error
	return
}

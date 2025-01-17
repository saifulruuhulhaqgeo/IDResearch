package domains

import (
	"context"
	"time"
)

type Topic struct {
	ID               string    `gorm:"column:id" json:"id"`
	Name             string    `gorm:"column:name" json:"name"`
	Description      string    `gorm:"column:description" json:"description"`
	TotalInformation int64     `gorm:"column:total_informations" json:"total_informations"`
	CreatedAt        time.Time `gorm:"column:created_at" json:"created_at"`
	SearchCount      int64     `gorm:"column:search_count" json:"search_count"`
}

type ITopicDataUseCase interface {
	GetAllTopic(ctx context.Context, daerahCode int) (topics []Topic, err error)
	GetAllTopicTable(ctx context.Context, page, perPage int64, keyword string) (topics []Topic, total int64, err error)
	CreateTopic(ctx context.Context, topic Topic) (err error)
	UpdateTopic(ctx context.Context, topic Topic) (err error)
	Delete(ctx context.Context, id string) (err error)
}

type ITopicDataRepository interface {
	GetAllTopic(ctx context.Context, daerahCode int) (topics []Topic, err error)
	GetAllTopicTable(ctx context.Context, offset, limit int64, keyword string) (topics []Topic, err error)
	GetTotalTopicTable(ctx context.Context, keyword string) (total int64, err error)
	CreateTopic(ctx context.Context, topic Topic) (err error)
	UpdateTopic(ctx context.Context, topic Topic) (err error)
	Delete(ctx context.Context, id string) (err error)
}

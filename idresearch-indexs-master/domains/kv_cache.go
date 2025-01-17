package domains

import "time"

type KVCache struct {
	Key       string    `gorm:"column:key"`
	Value     string    `gorm:"column:value"`
	CreatedAt time.Time `gorm:"column:created_at"`
}

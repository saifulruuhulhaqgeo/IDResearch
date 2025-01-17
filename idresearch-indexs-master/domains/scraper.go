package domains

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type ScraperTopic struct {
	TopicName string    `gorm:"column:name"`
	TopicID   uuid.UUID `gorm:"column:id"`
}
type ScraperDaerah struct {
	DaerahName string `gorm:"column:name"`
	DaerahCode int    `gorm:"column:code"`
}
type ScraperAgent struct {
	ID                 uuid.UUID `json:"id" gorm:"column:id"`
	Label              string    `json:"label" gorm:"column:label"`
	AgentIP            string    `json:"agent_ip" gorm:"column:agent_ip"`
	LastIngestTime     time.Time `json:"last_ingest_time" gorm:"column:last_ingest_time"`
	DataCollectedTotal int64     `json:"data_collected" gorm:"column:data_collected"`
	Active             bool      `json:"active" gorm:"column:active"`
	Key                string    `json:"key" gorm:"column:key"`
	TailLog            string    `json:"tail_log" gorm:"column:tail_log"`
}

type ScraperLock struct {
	ID           uuid.UUID `gorm:"column:id"`
	LastLockedAt time.Time `gorm:"column:locked_at"`
	ScraperLabel string    `gorm:"column:scraper_label"`
	DaerahLevel  int       `gorm:"column:daerah_level"`
	DaerahLabel  string    `gorm:"column:daerah_label"`
	Topic        string    `gorm:"column:topic"`
}

type ScraperParameter struct {
	DaerahLabel string `json:"daerah_label"`
	DaerahLevel int    `json:"daerah_level"`
	Topic       string `json:"topic"`
	TopicID     string `json:"topic_id"`
	DaerahCode  int    `json:"daerah_code"`
}

type IScraperUseCase interface {
	GetScraperParameter(ctx context.Context, agent ScraperAgent) (ScraperParameter, error)
}

type IScraperRepository interface {
	GetDaerahAndTopic(ctx context.Context) (ScraperTopic, ScraperDaerah, int, error)
}

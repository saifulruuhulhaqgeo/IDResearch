package domains

import (
	"context"
)

type Desas struct {
	ID                   string `gorm:"column:id"`
	Label                string `gorm:"column:label"`
	Description          string `gorm:"column:label"`
	Geom                 string `gorm:"column:area"`
	TotalInformation     int64  `gorm:"columns:total_informations"`
	SelfTotalInformation int64  `gorm:"column:self_total_information"`
	DesaCode             int64  `gorm:"column:desa_code"`
}

type IDesaDataUseCase interface {
	GetAllDesaGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
}

type IDesaDataRepository interface {
	GetAllDesaGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
}

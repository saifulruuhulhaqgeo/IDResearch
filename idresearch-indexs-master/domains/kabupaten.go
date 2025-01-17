package domains

import (
	"context"
)

type Kabupatens struct {
	ID                   string `gorm:"column:id"`
	Label                string `gorm:"column:label"`
	Description          string `gorm:"column:label"`
	Geom                 string `gorm:"column:area"`
	TotalInformation     int64  `gorm:"columns:total_informations"`
	SelfTotalInformation int64  `gorm:"column:self_total_information"`
	KabupatenCode        int64  `gorm:"column:kabupaten_code"`
}

type IKabupatenDataUseCase interface {
	GetAllKabupatenGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
}

type IKabupatenDataRepository interface {
	GetAllKabupatenGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
}

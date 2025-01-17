package domains

import (
	"context"
)

type Kecamatans struct {
	ID                   string `gorm:"column:id"`
	Label                string `gorm:"column:label"`
	Description          string `gorm:"column:label"`
	Geom                 string `gorm:"column:area"`
	TotalInformation     int64  `gorm:"columns:total_informations"`
	SelfTotalInformation int64  `gorm:"column:self_total_information"`
	KecamatanCode        int64  `gorm:"column:kecamatan_code"`
}

type IKecamatanDataUseCase interface {
	GetAllKecamatanGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
}

type IKecamatanDataRepository interface {
	GetAllKecamatanGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
}

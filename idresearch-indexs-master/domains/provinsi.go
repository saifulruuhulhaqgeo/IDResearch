package domains

import (
	"context"
)

type GeoJSONFeatureCollection struct {
	Type     string    `json:"type"`
	Features []Feature `json:"features"`
}

type Geometry struct {
	Type        string        `json:"type"`
	Coordinates [][][]float64 `json:"coordinates"`
}

type Bounds struct {
	West  float64
	South float64
	East  float64
	North float64
}

type Feature struct {
	Type        string         `json:"type"`
	Properties  map[string]any `json:"properties"`
	Coordinates map[string]any `json:"geometry"`
}

type Provinsis struct {
	ID                   string `gorm:"column:id"`
	Label                string `gorm:"column:label"`
	Description          string `gorm:"column:label"`
	Geom                 string `gorm:"column:area"`
	TotalInformation     int64  `gorm:"column:total_informations"`
	SelfTotalInformation int64  `gorm:"column:self_total_information"`
	ProvinsiCode         int64  `gorm:"column:provinsi_code"`
}

type IProvinsiDataUseCase interface {
	GetAllProvinsiGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
	GetProvinsiStats(ctx context.Context) (provinsis []Provinsis, ere error)
}

type IProvinsiDataRepository interface {
	GetAllProvinsiGeoJSON(ctx context.Context, bound Bounds, topicId, keyword string) (GeoJSONFeatureCollection, error)
	GetProvinsiStats(ctx context.Context) (provinsis []Provinsis, ere error)
}

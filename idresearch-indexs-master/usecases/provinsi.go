package usecases

import (
	"context"
	"idresearch-web/domains"
)

type ProvinsiDataUseCase struct {
	provinsiRepository domains.IProvinsiDataRepository
}

func NewProvinsiDataUseCase(provinsiRepository domains.IProvinsiDataRepository) domains.IProvinsiDataUseCase {
	return &ProvinsiDataUseCase{
		provinsiRepository: provinsiRepository,
	}
}

func (u *ProvinsiDataUseCase) GetProvinsiStats(ctx context.Context) (provinsis []domains.Provinsis, ere error) {
	provinsis, ere = u.provinsiRepository.GetProvinsiStats(ctx)
	return
}

func (u *ProvinsiDataUseCase) GetAllProvinsiGeoJSON(ctx context.Context, bound domains.Bounds, topicId, keyword string) (domains.GeoJSONFeatureCollection, error) {
	return u.provinsiRepository.GetAllProvinsiGeoJSON(ctx, bound, topicId, keyword)
}

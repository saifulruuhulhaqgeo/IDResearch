package usecases

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"

	"go.opentelemetry.io/otel"
)

type KabupatenDataUseCase struct {
	provinsiRepository domains.IKabupatenDataRepository
	traceName          string
}

func NewKabupatenDataUseCase(provinsiRepository domains.IKabupatenDataRepository) domains.IKabupatenDataUseCase {
	return &KabupatenDataUseCase{
		provinsiRepository: provinsiRepository,
		traceName:          "kabupaten_geojson",
	}
}

func (u *KabupatenDataUseCase) GetAllKabupatenGeoJSON(ctx context.Context, bound domains.Bounds, topicId, keyword string) (geojson domains.GeoJSONFeatureCollection, err error) {
	rctx, span := otel.Tracer(u.traceName).Start(ctx, "uc get all")
	defer span.End()

	geojson, err = u.provinsiRepository.GetAllKabupatenGeoJSON(rctx, bound, topicId, keyword)
	if err != nil {
		common.TraceError(span, err)
		return
	}
	return
}

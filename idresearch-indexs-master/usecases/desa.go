package usecases

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"

	"go.opentelemetry.io/otel"
)

type DesaDataUseCase struct {
	desaRepository domains.IDesaDataRepository
	traceName      string
}

func NewDesaDataUseCase(desaRepository domains.IDesaDataRepository) domains.IDesaDataUseCase {
	return &DesaDataUseCase{
		desaRepository: desaRepository,
		traceName:      "kabupaten_geojson",
	}
}

func (u *DesaDataUseCase) GetAllDesaGeoJSON(ctx context.Context, bound domains.Bounds, topicId, keyword string) (geojson domains.GeoJSONFeatureCollection, err error) {
	rctx, span := otel.Tracer(u.traceName).Start(ctx, "uc get all")
	defer span.End()

	geojson, err = u.desaRepository.GetAllDesaGeoJSON(rctx, bound, topicId, keyword)
	if err != nil {
		common.TraceError(span, err)
		return
	}
	return
}

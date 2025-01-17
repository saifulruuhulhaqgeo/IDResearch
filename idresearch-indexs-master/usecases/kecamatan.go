package usecases

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"

	"go.opentelemetry.io/otel"
)

type KecamatanDataUseCase struct {
	provinsiRepository domains.IKecamatanDataRepository
	traceName          string
}

func NewKecamatanDataUseCase(provinsiRepository domains.IKecamatanDataRepository) domains.IKecamatanDataUseCase {
	return &KecamatanDataUseCase{
		provinsiRepository: provinsiRepository,
		traceName:          "kabupaten_geojson",
	}
}

func (u *KecamatanDataUseCase) GetAllKecamatanGeoJSON(ctx context.Context, bound domains.Bounds, topicId, keyword string) (geojson domains.GeoJSONFeatureCollection, err error) {
	rctx, span := otel.Tracer(u.traceName).Start(ctx, "uc get all")
	defer span.End()

	geojson, err = u.provinsiRepository.GetAllKecamatanGeoJSON(rctx, bound, topicId, keyword)
	if err != nil {
		common.TraceError(span, err)
		return
	}
	return
}

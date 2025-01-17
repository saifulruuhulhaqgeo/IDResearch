package repositories

import (
	"context"
	"encoding/json"
	"fmt"
	"idresearch-web/domains"
	"strings"

	"gorm.io/gorm"
)

type DesaDataRepository struct {
	db *gorm.DB
}

func NewDesaDataRepository(db *gorm.DB) domains.IDesaDataRepository {
	return &DesaDataRepository{
		db,
	}
}

func (r *DesaDataRepository) GetAllDesaGeoJSON(ctx context.Context, bound domains.Bounds, topicId, keyword string) (domains.GeoJSONFeatureCollection, error) {
	var desas []domains.Desas

	subQ := " "

	if topicId != "" {
		subQ += " WHERE "

		subQ += fmt.Sprintf(" information_lake.topik_id = '%s'", topicId)
	}

	if keyword != "" {
		//subQ += " AND information_lake.title ILIKE '%" + keyword + "%'"

		if topicId != "" {
			subQ += " AND "
		} else {
			subQ += " WHERE "
		}

		if len(strings.Split(keyword, " ")) > 1 {
			keyword = strings.ReplaceAll(keyword, " ", " >-< ")
		}
		subQ += fmt.Sprintf(" reverse(information_lake.title) @@ (reverse('%s') || ':*')::tsquery", keyword)
	}

	query := r.db.WithContext(ctx).Debug().Table("desa").
		Raw(fmt.Sprintf(`
SELECT id, desa.desa_code, st_asgeojson(geoarea) area, label, description, 0 total_informations, x.total self_total_information FROM desa FULL OUTER JOIN
(SELECT count(information_lake.daerah_code) total, information_lake.daerah_code FROM information_lake
	%s
GROUP BY information_lake.daerah_code)
x
ON x.daerah_code = desa.desa_code WHERE desa.geoarea && ST_MakeEnvelope(?, ?, ?, ?,  4326)
		`, subQ), bound.West, bound.South, bound.East, bound.North)
	query.Find(&desas)

	var geojonFeaturesCollection domains.GeoJSONFeatureCollection
	geojonFeaturesCollection.Type = "FeatureCollection"
	for _, v := range desas {
		properties := map[string]any{
			"fid":                     v.ID,
			"label":                   v.Label,
			"description":             v.Description,
			"total_informations":      v.TotalInformation,
			"self_total_informations": v.SelfTotalInformation,
			"code":                    v.DesaCode,
			"level":                   4,
		}

		var geometry map[string]any
		err := json.Unmarshal([]byte(v.Geom), &geometry)
		if err == nil {
			geojonFeaturesCollection.Features = append(geojonFeaturesCollection.Features, domains.Feature{
				Type:        "Feature",
				Properties:  properties,
				Coordinates: geometry,
			})
		}
		//log.Println("Total features", len(geojonFeaturesCollection.Features))

	}
	return geojonFeaturesCollection, r.db.Error
}

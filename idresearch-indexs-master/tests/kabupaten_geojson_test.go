package tests

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
)

func TestGetAllKabupatenGeoJSON(t *testing.T) {
	common.InitApplicationConfig("../")
	dbCon := common.NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)
	repo := repositories.NewKabupatenDataRepository(dbCon)

	t.Run("get all kabupaten geojson must be no error", func(r *testing.T) {

		jawaBounds := domains.Bounds{
			North: -1.4665146521435322,
			East:  108.90747070312501,
			South: -3.984820817420308,
			West:  100.99731445312501,
		}

		_, err := repo.GetAllKabupatenGeoJSON(context.Background(), jawaBounds)

		assert.Nil(t, err)

	})

}

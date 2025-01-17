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

func TestGetAllProvinsiGeoJSON(t *testing.T) {
	common.InitApplicationConfig("../")
	dbCon := common.NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)
	repo := repositories.NewProvinsiDataRepository(dbCon)

	t.Run("get all provinsi geojson must be no error", func(r *testing.T) {

		jawaBounds := domains.Bounds{}

		_, err := repo.GetAllProvinsiGeoJSON(context.Background(), jawaBounds)

		assert.Nil(t, err)

	})

	t.Run("get all provinsi on zero bbox geojson", func(r *testing.T) {

		jawaBounds := domains.Bounds{}

		_, err := repo.GetAllProvinsiGeoJSON(context.Background(), jawaBounds)

		assert.Nil(t, err)

	})
}

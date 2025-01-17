package tests

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"idresearch-web/usecases"
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
)

func TestGetAllResearchByDaerahAndFilter(t *testing.T) {
	common.InitApplicationConfig("../")
	dbCon := common.NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)
	repo := repositories.NewInformationRepository(
		dbCon,
		viper.GetString("scopus.host"),
		viper.GetString("scopus.api_key_1"),
		viper.GetString("scopus_key_2"),
	)
	redisClient := common.NewRedisConn("redis-12006.c8.us-east-1-4.ec2.cloud.redislabs.com:12006")

	dlm := common.NewDLM(redisClient)

	t.Run("get all research about daerah and from scopus API", func(r *testing.T) {
		uc := usecases.NewInformationUseCase(repo, dlm)
		_, _, err := uc.GetInformationDataByDaerah(context.Background(), 1, 33, 1, "provinsi jawa tengah", domains.InformationDataFilter{
			AnyYears:  false,
			AnyTopic:  false,
			YearStart: 2020,
			YearEnd:   2022,
			TopicID:   "00000000-0000-0000-0000-000000000000",
		})

		assert.Nil(t, err)

	})

}

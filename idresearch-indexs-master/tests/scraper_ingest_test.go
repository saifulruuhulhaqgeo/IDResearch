package tests

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"idresearch-web/usecases"
	"testing"

	"github.com/go-redis/redis/v9"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
)

func TestGetScraperTopikAndDaerah(t *testing.T) {
	common.InitApplicationConfig("../")
	dbCon := common.NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)
	redisClient := redis.NewClient(&redis.Options{
		Network: "tcp",
		Addr:    "127.0.0.1:6379",
	})
	dlm := common.NewDLM(redisClient)

	repo := repositories.NewScraperRepository(dbCon)

	uc := usecases.NewScraperUseCase(repo, dlm)
	t.Run("get topic and daerah must be no lock ", func(r *testing.T) {

		scraperAgent := domains.ScraperAgent{
			Label: "scholar_3",
		}

		_, err := uc.GetScraperParameter(context.Background(), scraperAgent)

		assert.Nil(t, err)

	})

}

func TestSaveScraperStats(t *testing.T) {
	common.InitApplicationConfig("../")
	dbCon := common.NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)

	repo := repositories.NewInformationRepository(dbCon, "", "", "")

	t.Run("get topic and daerah must be no lock ", func(r *testing.T) {

		err := repo.AddCountInformationData(context.Background(), domains.InformationLake{
			Title:       "title from testing",
			DaerahLevel: 2,
			Links:       []string{"http://blabla.com"},
			Stats: domains.ScraperAgent{
				Label:   "testing_scraper",
				AgentIP: "127.0.0.1",
			},
		})

		assert.Nil(t, err)

	})

}

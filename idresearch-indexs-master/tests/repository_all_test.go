package tests

import (
	"context"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"testing"
	"time"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
)

func TestIngestInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	err := repo.IngestInformation(context.Background(), domains.InformationLake{
		Title: fmt.Sprintf("title at %d", time.Now().Unix()),
	})

	assert.Nil(t, err)
}

func TestGetAllInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	_, err := repo.GetAllInformationLake(context.Background(), 1, 10, "")

	assert.Nil(t, err)
}

func TestGetTotalInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	_, err := repo.GetTotalInformationLake(context.Background(), "")

	assert.Nil(t, err)
}

func TestGetDeleteInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	literatures, err := repo.GetAllInformationLake(context.Background(), 1, 10, "")

	err = repo.Delete(context.Background(), literatures[0].ID.String())

	assert.Nil(t, err)
}

func TestUpdateTopicToUndefined(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	err := repo.UpdateTopicToUndefined(context.Background(), "00000000-0000-0000-0000-000000000000")

	assert.Nil(t, err)
}

func TestGetSourceLiterature(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	_, err := repo.GetSourceLiteraturesStats(context.Background())

	assert.Nil(t, err)
}

func TestScraperStats(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")

	_, err := repo.GetScrapedStats(context.Background())
	assert.Nil(t, err)
}

func TestInitFolderRepository(t *testing.T) {

	repo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	assert.IsType(t, &repositories.CollectionFolderRepository{}, repo)
}

func TestCreateLiteraturFolder(t *testing.T) {

	repo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())

	err = repo.CreateFolder(context.Background(), domains.CollectionFolder{
		Name:        "myfolder",
		Description: "myfolder awesome",
		IsPublic:    true,
		UserID:      users[0].ID,
	})
	assert.Nil(t, err)
}

func TestSaveLiteraturToFolder(t *testing.T) {

	folderRepo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())

	folders, err := folderRepo.GetCollectionFolderByUser(context.Background(), users[0].ID)

	err = folderRepo.SaveCollectionToFolder(context.Background(), domains.CollectionPayload{
		FolderID:       folders[0].ID,
		CollectionType: "",
		CollectionData: "{}",
	})

	assert.Nil(t, err)
}

func TestInitKecamatanRepository(t *testing.T) {

	repo := repositories.NewKecamatanDataRepository(common.CreateDbCon())
	assert.IsType(t, &repositories.KecamatanDataRepository{}, repo)
}

func TestGetAllKecamatanGeoJSON(t *testing.T) {

	repo := repositories.NewKecamatanDataRepository(common.CreateDbCon())

	t.Run("get all kecamatan geojson must be no error", func(r *testing.T) {

		jawaBounds := domains.Bounds{
			North: -1.4665146521435322,
			East:  108.90747070312501,
			South: -3.984820817420308,
			West:  100.99731445312501,
		}

		_, err := repo.GetAllKecamatanGeoJSON(context.Background(), jawaBounds)

		assert.Nil(t, err)

	})

}

func TestGetProvinsiStats(t *testing.T) {
	repo := repositories.NewProvinsiDataRepository(common.CreateDbCon())
	_, err := repo.GetProvinsiStats(context.Background())
	assert.Nil(t, err)
}

func TestInitTopicRepository(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	assert.IsType(t, &repositories.TopicRepository{}, repo)
}

func TestCreateTopic(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	err := repo.CreateTopic(context.Background(), domains.Topic{
		Name: fmt.Sprintf("mytopic %d", time.Now().Unix()),
	})
	if err != nil {
		if err.Error() != `ERROR: duplicate key value violates unique constraint "topic_name" (SQLSTATE 23505)` {
			assert.Nil(t, err)
		}
	} else {
		assert.Nil(t, err)
	}
}

func TestGetAllTopic(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	_, err := repo.GetAllTopic(context.Background(), 0)
	assert.Nil(t, err)
}

func TestGetAllTopicTable(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	_, err := repo.GetAllTopicTable(context.Background(), 0, 5, "")
	assert.Nil(t, err)
}

func TestGetTotalTopicTable(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	_, err := repo.GetTotalTopicTable(context.Background(), "")
	assert.Nil(t, err)
}

func TestUpdateTopic(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())

	topics, err := repo.GetAllTopic(context.Background(), 0)
	topics[0].Description = fmt.Sprintf("edited at %s", time.Now().String())
	err = repo.UpdateTopic(context.Background(), topics[0])
	if err != nil {
		if err.Error() != `ERROR: duplicate key value violates unique constraint "topic_name" (SQLSTATE 23505)` {
			assert.Nil(t, err)
		}
	} else {
		assert.Nil(t, err)
	}
}

func TestDeleteTopic(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())

	err := repo.Delete(context.Background(), "00000000-0000-0000-0000-000000000000")
	assert.Nil(t, err)
}

func TestInitNewsRepository(t *testing.T) {

	repo := repositories.NewNewsDataRepository(nil, "")
	assert.IsType(t, &repositories.NewsDataRepository{}, repo)
}

func TestGetNews(t *testing.T) {

	repo := repositories.NewNewsDataRepository(common.CreateDbCon(), "http://localhost:5000")
	daerah := "bandung"
	_, err := repo.GetGoogleNewsFromDaerah(context.Background(), daerah)
	if err != nil {
		_, err := repo.GetGoogleNewsFromDaerah(context.Background(), daerah)
		assert.Nil(t, err)
	} else {
		assert.Nil(t, err)
	}
}

func TestGetNewsNoCache(t *testing.T) {

	repo := repositories.NewNewsDataRepository(common.CreateDbCon(), "http://localhost:5000")
	daerah := fmt.Sprintf("%s %s", "bandung", time.Now().String())
	_, err := repo.GetGoogleNewsFromDaerah(context.Background(), daerah)
	assert.Nil(t, err)
}

func TestGetUserByEmail(t *testing.T) {

	repo := repositories.NewUserRepository(common.CreateDbCon())
	_, err := repo.GetUserByEmail(context.Background(), "alfiankan19@gmail.com")
	assert.Nil(t, err)
}

func TestCreateUser(t *testing.T) {

	repo := repositories.NewUserRepository(common.CreateDbCon())
	err := repo.CreateUser(context.Background(), domains.User{
		Email:    fmt.Sprintf("test_%d@gmail.com", time.Now().Unix()),
		FullName: fmt.Sprintf("test_%d", time.Now().Unix()),
		Role:     "USR",
	})
	assert.Nil(t, err)
}

func TestUpdateUserByEmail(t *testing.T) {

	repo := repositories.NewUserRepository(common.CreateDbCon())
	err := repo.UpdateUserByEmail(context.Background(), domains.User{
		Email:     "alfiankan19@gmail.com",
		LastToken: "12345",
	})
	assert.Nil(t, err)
}

func TestGetUserInfoGoogle(t *testing.T) {

	repo := repositories.NewUserRepository(common.CreateDbCon())
	_, err := repo.GetUserAccountInformation(context.Background(), "badtoken")
	assert.Error(t, err)
}

func TestAddGooglenewsCache(t *testing.T) {

	repo := repositories.NewNewsDataRepository(common.CreateDbCon(), "http://127.0.0.1:5000")
	err := repo.AddGoogleNewsCache(context.Background(), "bandung", []domains.GoogleNews{})
	assert.Nil(t, err)
}

func TestGetLiteraturFromScopus(t *testing.T) {

	informationLakeRepo := repositories.NewInformationRepository(
		common.CreateDbCon(),
		viper.GetString("scopus.host"),
		viper.GetString("scopus.api_key_1"),
		viper.GetString("scopus_key_2"),
	)

	res, _ := informationLakeRepo.GetInformationDataFromScopusAPI(context.Background(), 2, "bandung")
	assert.True(t, len(res) > 0)
}

func TestGetTopicChartByDaerahCode(t *testing.T) {

	informationLakeRepo := repositories.NewTopicRepository(common.CreateDbCon())

	_, err := informationLakeRepo.GetAllTopic(context.Background(), 32)
	assert.Nil(t, err)
}

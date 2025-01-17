package tests

import (
	"context"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"idresearch-web/usecases"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/valyala/fasthttp"
)

func TestNewKabupatenDataUseCase(t *testing.T) {

	uc := usecases.NewKabupatenDataUseCase(nil)
	assert.IsType(t, &usecases.KabupatenDataUseCase{}, uc)
}

func TestUcGetAllKabupatenGeoJSON(t *testing.T) {
	repo := repositories.NewKabupatenDataRepository(common.CreateDbCon())
	uc := usecases.NewKabupatenDataUseCase(repo)
	jawaBounds := domains.Bounds{
		North: -1.4665146521435322,
		East:  108.90747070312501,
		South: -3.984820817420308,
		West:  100.99731445312501,
	}

	_, err := uc.GetAllKabupatenGeoJSON(context.Background(), jawaBounds)
	assert.Nil(t, err)
}

func TestNewKecamatanDataUseCase(t *testing.T) {

	uc := usecases.NewKecamatanDataUseCase(nil)
	assert.IsType(t, &usecases.KecamatanDataUseCase{}, uc)
}

func TestUcGetAllKecamatanGeoJSON(t *testing.T) {
	repo := repositories.NewKecamatanDataRepository(common.CreateDbCon())
	uc := usecases.NewKecamatanDataUseCase(repo)
	jawaBounds := domains.Bounds{
		North: -1.4665146521435322,
		East:  108.90747070312501,
		South: -3.984820817420308,
		West:  100.99731445312501,
	}

	_, err := uc.GetAllKecamatanGeoJSON(context.Background(), jawaBounds)
	assert.Nil(t, err)
}

func TestUcIngestInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewInformationUseCase(repo, common.NewDLM(common.NewRedisConn("127.0.0.1:3369")))
	err := uc.IngestInformation(context.Background(), domains.InformationLake{
		Title:       fmt.Sprintf("title at %d", time.Now().Unix()),
		DaerahLevel: 1,
		DaerahLabel: "JAWA BARAT",
		DaerahCode:  32,
	})
	assert.Nil(t, err)

}

func TestUcGetAllInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewInformationUseCase(repo, common.NewDLM(common.NewRedisConn("127.0.0.1:3369")))
	_, _, err := uc.GetAllInformationLake(context.Background(), 1, 10, "")
	assert.Nil(t, err)

}

func TestUcDeleteInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	literatures, err := repo.GetAllInformationLake(context.Background(), 1, 5, "")
	uc := usecases.NewInformationUseCase(repo, common.NewDLM(common.NewRedisConn("127.0.0.1:3369")))
	err = uc.Delete(context.Background(), literatures[0].ID.String())
	assert.Nil(t, err)

}

func TestUcGetResourceChartDataInformationLake(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewInformationUseCase(repo, common.NewDLM(common.NewRedisConn("127.0.0.1:3369")))
	_, err := uc.GetSourceLiteraturesStats(context.Background())
	assert.Nil(t, err)

}

func TestUcGetscrapeddatas(t *testing.T) {

	repo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewInformationUseCase(repo, common.NewDLM(common.NewRedisConn("127.0.0.1:3369")))
	_, err := uc.GetScrapedStats(context.Background())
	assert.Nil(t, err)

}

func TestNewProvinsiDataUseCase(t *testing.T) {

	uc := usecases.NewProvinsiDataUseCase(nil)
	assert.IsType(t, &usecases.ProvinsiDataUseCase{}, uc)
}

func TestUcGetAllProvinsiGeoJSON(t *testing.T) {
	repo := repositories.NewProvinsiDataRepository(common.CreateDbCon())
	uc := usecases.NewProvinsiDataUseCase(repo)
	jawaBounds := domains.Bounds{
		North: -1.4665146521435322,
		East:  108.90747070312501,
		South: -3.984820817420308,
		West:  100.99731445312501,
	}

	_, err := uc.GetAllProvinsiGeoJSON(context.Background(), jawaBounds)
	assert.Nil(t, err)
}

func TestUcGetAllProvinsiStats(t *testing.T) {
	repo := repositories.NewProvinsiDataRepository(common.CreateDbCon())
	uc := usecases.NewProvinsiDataUseCase(repo)

	_, err := uc.GetProvinsiStats(context.Background())
	assert.Nil(t, err)
}

func TestInitTopicUsecase(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	lakeRepo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewTopicDataUseCase(repo, lakeRepo)
	assert.IsType(t, &usecases.TopicDataUseCase{}, uc)
}

func TestUcCreateTopic(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	lakeRepo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewTopicDataUseCase(repo, lakeRepo)

	err := uc.CreateTopic(context.Background(), domains.Topic{
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

func TestUcGetAllTopic(t *testing.T) {
	repo := repositories.NewTopicRepository(common.CreateDbCon())
	lakeRepo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewTopicDataUseCase(repo, lakeRepo)
	_, err := uc.GetAllTopic(context.Background())
	assert.Nil(t, err)
}

func TestUcGetAllTopicTable(t *testing.T) {
	repo := repositories.NewTopicRepository(common.CreateDbCon())
	lakeRepo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewTopicDataUseCase(repo, lakeRepo)
	_, _, err := uc.GetAllTopicTable(context.Background(), 1, 5, "bandung")
	assert.Nil(t, err)
}

func TestUcUpdateTopic(t *testing.T) {
	repo := repositories.NewTopicRepository(common.CreateDbCon())
	lakeRepo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewTopicDataUseCase(repo, lakeRepo)

	topics, err := uc.GetAllTopic(context.Background())
	topics[0].Description = fmt.Sprintf("edited at %s", time.Now().String())
	err = uc.UpdateTopic(context.Background(), topics[0])
	if err != nil {
		if err.Error() != `ERROR: duplicate key value violates unique constraint "topic_name" (SQLSTATE 23505)` {
			assert.Nil(t, err)
		}
	} else {
		assert.Nil(t, err)
	}
}

func TestUcDeleteTopic(t *testing.T) {

	repo := repositories.NewTopicRepository(common.CreateDbCon())
	lakeRepo := repositories.NewInformationRepository(common.CreateDbCon(), "", "", "")
	uc := usecases.NewTopicDataUseCase(repo, lakeRepo)
	err := uc.Delete(context.Background(), "00000000-0000-0000-0000-000000000000")
	assert.Nil(t, err)
}

func TestUcGetAllUser(t *testing.T) {

	repo := repositories.NewUserRepository(common.CreateDbCon())
	uc := usecases.NewUserUseCase(repo)
	_, err := uc.GetAllUser(context.Background())
	assert.Nil(t, err)
}

func TestUcChangeRoleUser(t *testing.T) {

	repo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := repo.GetAllUser(context.Background())
	uc := usecases.NewUserUseCase(repo)
	err = uc.ChangeRoleUser(context.Background(), "ADM", users[0].ID)
	assert.Nil(t, err)
}

func TestInitNewsUseCase(t *testing.T) {

	repo := repositories.NewNewsDataRepository(common.CreateDbCon(), "")
	uc := usecases.NewNewsDataUseCase(repo)
	assert.IsType(t, &usecases.NewsDataUseCase{}, uc)
}

func TestInitFolderUseCase(t *testing.T) {

	repo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	uc := usecases.NewCollectionFolderDataUseCase(repo)
	assert.IsType(t, &usecases.CollectionFolderDataUseCase{}, uc)
}

func TestGetCollectionFolderByUser(t *testing.T) {
	repo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	uc := usecases.NewCollectionFolderDataUseCase(repo)
	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())

	app := fiber.New()
	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})
	userTokenClaims := &domains.User{
		ID: users[0].ID,
	}
	ctx.SetUserContext(context.WithValue(ctx.UserContext(), common.USER_CLAIMS_TOKEN, userTokenClaims))

	_, err = uc.GetCollectionFolderByUser(ctx.UserContext())
	assert.Nil(t, err)
}

func TestUcCreateLiteraturFolder(t *testing.T) {

	repo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	uc := usecases.NewCollectionFolderDataUseCase(repo)
	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())

	app := fiber.New()
	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})
	userTokenClaims := &domains.User{
		ID: users[0].ID,
	}

	ctx.SetUserContext(context.WithValue(ctx.UserContext(), common.USER_CLAIMS_TOKEN, userTokenClaims))
	err = uc.CreateFolder(ctx.UserContext(), domains.CollectionFolder{
		Name: fmt.Sprintf("my folder %s", time.Now().String()),
	})
	assert.Nil(t, err)
}

func TestUcSaveLiteraturToFolder(t *testing.T) {

	folderRepo := repositories.NewCollectionFolderRepository(common.CreateDbCon())
	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())
	uc := usecases.NewCollectionFolderDataUseCase(folderRepo)

	folders, err := folderRepo.GetCollectionFolderByUser(context.Background(), users[0].ID)

	err = uc.SaveCollectionToFolder(context.Background(), domains.CollectionPayload{
		FolderID:       folders[0].ID,
		CollectionType: "",
		CollectionData: "{}",
	})

	assert.Nil(t, err)
}

func TestUcGEtgoogleNewDaerah(t *testing.T) {
	repo := repositories.NewNewsDataRepository(common.CreateDbCon(), "http://127.0.0.1:5000")
	uc := usecases.NewNewsDataUseCase(repo)
	_, err := uc.GetGoogleNewsFromDaerah(context.Background(), "bandung")

	assert.Nil(t, err)
}

func TestUcCreateNewUserObjekMetadataGoogle(t *testing.T) {
	repo := repositories.NewUserRepository(common.CreateDbCon())
	uc := usecases.UserUseCase{
		UserRepository: repo,
	}
	_, err := uc.CreateNewUser(context.Background(), domains.GoogleUserInfo{}, "mytoken", "alfiankan19@gmail.com")
	assert.Nil(t, err)
}

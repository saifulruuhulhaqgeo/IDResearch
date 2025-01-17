package webservice

import (
	"idresearch-web/common"
	"idresearch-web/controllers"
	"idresearch-web/domains"
	"idresearch-web/models"
	"idresearch-web/repositories"
	"idresearch-web/usecases"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/spf13/viper"
	"gorm.io/gorm"
)

type TimeSeries struct {
	CollectedAt time.Time `gorm:"column:in_time"`
	Value       string    `gorm:"column:total"`
}

type WSResponse struct {
	Series   []TimeSeries
	Scrapers []domains.ScraperAgent
}

func InitWebSocket(app *fiber.App, pgCon *gorm.DB) {

	app.Use("/ws", func(c *fiber.Ctx) error {

		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/scraper/stats", websocket.New(func(c *websocket.Conn) {
		for {
			time.Sleep(10 * time.Second)
			var chart []TimeSeries
			errStat := pgCon.Raw("SELECT  collected_at::timestamptz at time zone 'Asia/Jakarta' in_time, cast((time_series.value::json ->> 'total') as int) AS total FROM time_series WHERE key = 'scraper_collected' ORDER BY in_time ASC").Find(&chart).Error
			log.Println(errStat)

			var scrapers []domains.ScraperAgent
			errScraper := pgCon.Table("scrapers").Find(&scrapers)
			log.Println(errScraper)

			if err := c.WriteJSON(&models.BaseResponse{
				Message: "ok",
				Data: &WSResponse{
					Series:   chart,
					Scrapers: scrapers,
				},
			}); err != nil {
				log.Println("write:", err)
				break
			}
		}

	}))

}

func RunApp(app *fiber.App) *fiber.App {
	pgConn := common.NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)
	redisClient := common.NewRedisConn("redis-12006.c8.us-east-1-4.ec2.cloud.redislabs.com:12006")

	// APIS
	provinsiRepository := repositories.NewProvinsiDataRepository(pgConn)
	kabupatensRepository := repositories.NewKabupatenDataRepository(pgConn)
	kecamatanRepo := repositories.NewKecamatanDataRepository(pgConn)
	desaRepo := repositories.NewDesaDataRepository(pgConn)
	dlm := common.NewDLM(redisClient)

	scraperRepository := repositories.NewScraperRepository(pgConn)
	informationLakeRepo := repositories.NewInformationRepository(
		pgConn,
		viper.GetString("scopus.host"),
		viper.GetString("scopus.api_key_1"),
		viper.GetString("scopus_key_2"),
	)
	newsDataRepo := repositories.NewNewsDataRepository(
		pgConn,
		viper.GetString("news_services.google_news_host"),
	)
	userRepo := repositories.NewUserRepository(pgConn)
	topicRepo := repositories.NewTopicRepository(pgConn)
	collectionFolderRepo := repositories.NewCollectionFolderRepository(pgConn)

	provinsiUseCase := usecases.NewProvinsiDataUseCase(provinsiRepository)
	kabupatenUseCase := usecases.NewKabupatenDataUseCase(kabupatensRepository)
	kecamatanUseCase := usecases.NewKecamatanDataUseCase(kecamatanRepo)
	desaUseCase := usecases.NewDesaDataUseCase(desaRepo)

	scraperUseCase := usecases.NewScraperUseCase(scraperRepository, dlm)
	informationUseCase := usecases.NewInformationUseCase(informationLakeRepo, topicRepo, dlm)
	newsDataUseCase := usecases.NewNewsDataUseCase(newsDataRepo)
	userUseCase := usecases.NewUserUseCase(userRepo)
	topicUseCase := usecases.NewTopicDataUseCase(topicRepo, informationLakeRepo)
	collectionFolderUseCase := usecases.NewCollectionFolderDataUseCase(collectionFolderRepo)

	provinsiController := controllers.NewProvinsiAPIController(provinsiUseCase)
	provinsiController.Start(app)

	kabupatenController := controllers.NewKabupatenAPIController(kabupatenUseCase)
	kabupatenController.Start(app)

	kecamatanController := controllers.NewKecamatanAPIController(kecamatanUseCase)
	kecamatanController.Start(app)

	desaController := controllers.NewDesaAPIController(desaUseCase)
	desaController.Start(app)

	scraperAPIAcontroller := controllers.NewScraperIngestAPIController(scraperUseCase)
	scraperAPIAcontroller.Start(app)

	informationController := controllers.NewInformationAPIController(informationUseCase)
	informationController.Start(app)

	newsController := controllers.NewNewsAPIController(newsDataUseCase)
	newsController.Start(app)

	userController := controllers.NewUserAPIController(userUseCase)
	userController.Start(app)

	petaController := controllers.NewPetaViewController()
	petaController.Start(app)

	topicController := controllers.NewTopicAPIController(topicUseCase)
	topicController.Start(app)

	collectionFolderController := controllers.NewCollectionFolderAPIController(collectionFolderUseCase)
	collectionFolderController.Start(app)
	InitWebSocket(app, pgConn)
	return app
}

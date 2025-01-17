package main

import (
	"fmt"
	"idresearch-web/common"
	"os"

	log "github.com/sirupsen/logrus"
	"go.opentelemetry.io/otel"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/spf13/viper"

	"idresearch-web/cmd/webservice"
)

func main() {

	rootPath, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	common.InitApplicationConfig(rootPath)

	tracingProvider := common.InitTracing()
	otel.SetTracerProvider(tracingProvider)

	app := fiber.New(fiber.Config{})

	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed, // 1
	}))

	common.Cors(app)

	app.Static("/", "./frontend/build")
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.Status(200).SendString("OK")
	})

	webservice.RunApp(app)

	log.Fatal(app.Listen(fmt.Sprintf(":%s", viper.GetString("application.serve_port"))))
}

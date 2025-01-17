package controllers

import (
	"idresearch-web/domains"
	"idresearch-web/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

type ScraperIngestAPIController struct {
	scraperUseCase domains.IScraperUseCase
}

func NewScraperIngestAPIController(scraperUseCase domains.IScraperUseCase) ScraperIngestAPIController {
	return ScraperIngestAPIController{
		scraperUseCase: scraperUseCase,
	}
}

func (ctrl *ScraperIngestAPIController) GetScraperParameter(ctx *fiber.Ctx) error {

	var reqBody domains.ScraperAgent
	err := ctx.BodyParser(&reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	params, err := ctrl.scraperUseCase.GetScraperParameter(ctx.UserContext(), reqBody)
	log.Println(params)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success generating parameter and lock",
		Data:    params,
	})

}

func (ctrl *ScraperIngestAPIController) Start(app *fiber.App) {
	app.Post("/v1/scraper/parameters", ctrl.GetScraperParameter)
}

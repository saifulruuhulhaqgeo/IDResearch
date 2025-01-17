package controllers

import (
	"idresearch-web/domains"
	"idresearch-web/models"

	"github.com/gofiber/fiber/v2"
)

type NewsAPIController struct {
	newsDataUseCase domains.INewsDataUseCase
}

func NewNewsAPIController(newsDataUsecase domains.INewsDataUseCase) NewsAPIController {
	return NewsAPIController{
		newsDataUseCase: newsDataUsecase,
	}
}

func (ctrl *NewsAPIController) GetGoogleNews(ctx *fiber.Ctx) error {

	keyword := ctx.Query("q", "")

	news, err := ctrl.newsDataUseCase.GetGoogleNewsFromDaerah(ctx.UserContext(), keyword)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    news,
	})
}

func (ctrl *NewsAPIController) Start(app *fiber.App) {
	app.Get("/v1/news/google", ctrl.GetGoogleNews)
}

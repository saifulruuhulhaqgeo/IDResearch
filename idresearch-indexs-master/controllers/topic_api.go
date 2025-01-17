package controllers

import (
	"idresearch-web/domains"
	"idresearch-web/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type TopicAPIController struct {
	topicUsecase domains.ITopicDataUseCase
}

func NewTopicAPIController(topicUsecase domains.ITopicDataUseCase) TopicAPIController {
	return TopicAPIController{
		topicUsecase: topicUsecase,
	}
}

func (ctrl *TopicAPIController) GetAllTopics(ctx *fiber.Ctx) error {
	daerahCode, err := strconv.Atoi(ctx.Query("daerah_code", "0"))
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	time.Sleep(2 * time.Second)
	topics, err := ctrl.topicUsecase.GetAllTopic(ctx.UserContext(), daerahCode)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data:    topics,
	})

}

func (ctrl *TopicAPIController) GetAllTopicsTable(ctx *fiber.Ctx) error {

	page, err := strconv.Atoi(ctx.Query("page", "1"))
	perPage, err := strconv.Atoi(ctx.Query("per_page", "10"))
	keyword := ctx.Query("keyword", "")
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	topics, total, err := ctrl.topicUsecase.GetAllTopicTable(ctx.UserContext(), int64(page), int64(perPage), keyword)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data: &models.TopicPagingResponse{
			TotalDataFound: total,
			PageNow:        int64(page),
			TotalPage:      total / int64(perPage),
			Lists:          topics,
		},
	})

}

func (ctrl *TopicAPIController) CreateTopics(ctx *fiber.Ctx) error {

	var reqBody domains.Topic
	err := ctx.BodyParser(&reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	err = ctrl.topicUsecase.CreateTopic(ctx.UserContext(), reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data:    nil,
	})
}

func (ctrl *TopicAPIController) EditTopics(ctx *fiber.Ctx) error {

	var reqBody domains.Topic
	err := ctx.BodyParser(&reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	reqBody.ID = ctx.Params("id")

	err = ctrl.topicUsecase.UpdateTopic(ctx.UserContext(), reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data:    nil,
	})
}

func (ctrl *TopicAPIController) DeleteTopic(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	err := ctrl.topicUsecase.Delete(ctx.UserContext(), id)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data:    nil,
	})
}

func (ctrl *TopicAPIController) Start(app *fiber.App) {
	app.Get("/v1/topics", ctrl.GetAllTopics)

	app.Get("/v1/topics/table", ctrl.GetAllTopicsTable)
	app.Post("/v1/topics", ctrl.CreateTopics)
	app.Put("/v1/topics/:id", ctrl.EditTopics)
	app.Delete("/v1/topics/:id", ctrl.DeleteTopic)
}

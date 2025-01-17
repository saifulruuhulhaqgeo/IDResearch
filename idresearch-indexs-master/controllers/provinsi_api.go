package controllers

import (
	"fmt"
	"idresearch-web/domains"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type ProvinsiAPIController struct {
	provinsiDataUsecase domains.IProvinsiDataUseCase
}

func NewProvinsiAPIController(provinsiDataUsecase domains.IProvinsiDataUseCase) ProvinsiAPIController {
	return ProvinsiAPIController{
		provinsiDataUsecase: provinsiDataUsecase,
	}
}

func (ctrl *ProvinsiAPIController) GetProvinsiGeoJSON(ctx *fiber.Ctx) error {

	west, err := strconv.ParseFloat(ctx.Query("west", "0.0"), 64)
	south, err := strconv.ParseFloat(ctx.Query("south", "0.0"), 64)
	east, err := strconv.ParseFloat(ctx.Query("east", "0.0"), 64)
	north, err := strconv.ParseFloat(ctx.Query("north", "0.0"), 64)
	topicId := ctx.Query("topic_id", "")
	keyword := ctx.Query("keyword", "")

	fmt.Println(west, south, east, north)
	if err != nil {
		log.Println(err)
		return ctx.Status(400).JSON("ERRR")
	}

	provinsis, err := ctrl.provinsiDataUsecase.GetAllProvinsiGeoJSON(ctx.UserContext(), domains.Bounds{
		West:  west,
		South: south,
		East:  east,
		North: north,
	}, topicId, keyword)
	if err != nil {
		return ctx.Status(400).JSON("ERRROR")
	}
	return ctx.Status(200).JSON(provinsis)
}

func (ctrl *ProvinsiAPIController) GetProvinsiStatistik(ctx *fiber.Ctx) error {

	provinsis, err := ctrl.provinsiDataUsecase.GetProvinsiStats(ctx.UserContext())
	if err != nil {
		return ctx.Status(400).JSON("ERRROR")
	}
	return ctx.Status(200).JSON(provinsis)
}

func (ctrl *ProvinsiAPIController) Start(app *fiber.App) {
	app.Get("/v1/provinsis/geojson", ctrl.GetProvinsiGeoJSON)
	app.Get("/v1/provinsis/stats", ctrl.GetProvinsiStatistik)

}

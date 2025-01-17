package controllers

import (
	"fmt"
	"idresearch-web/domains"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
)

type DesaAPIController struct {
	provinsiDataUsecase domains.IDesaDataUseCase
}

func NewDesaAPIController(provinsiDataUsecase domains.IDesaDataUseCase) DesaAPIController {
	return DesaAPIController{
		provinsiDataUsecase: provinsiDataUsecase,
	}
}

func (ctrl *DesaAPIController) GetDesaGeoJSON(ctx *fiber.Ctx) error {

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

	rctx, span := otel.Tracer("kecamatan_geojson").Start(ctx.Context(), "accept request")
	span.SetAttributes(attribute.String("client_ip", ctx.IP()))
	defer span.End()
	provinsis, err := ctrl.provinsiDataUsecase.GetAllDesaGeoJSON(rctx, domains.Bounds{
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

func (ctrl *DesaAPIController) Start(app *fiber.App) {
	app.Get("/v1/desas/geojson", ctrl.GetDesaGeoJSON)
}

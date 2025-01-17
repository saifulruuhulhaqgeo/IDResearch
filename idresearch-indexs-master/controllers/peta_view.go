package controllers

import (
	"github.com/gofiber/fiber/v2"
)

type PetaViewController struct {
}

func NewPetaViewController() PetaViewController {
	return PetaViewController{}
}

func (ctrl *PetaViewController) RenderPetaView(ctx *fiber.Ctx) error {
	return ctx.Render("pages/peta", fiber.Map{
		"Title": "Peta | idresearch.net",
		"Page":  "Peta",
	})
}

func (ctrl *PetaViewController) Start(app *fiber.App) {
	app.Get("/peta", ctrl.RenderPetaView)
}

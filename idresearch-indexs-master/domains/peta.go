package domains

import (
	"github.com/gofiber/fiber/v2"
)

type IPetaView interface {
}

type IPetaViewController interface {
	RenderPetaView(ctx *fiber.Ctx) error
	Start(ctx *fiber.App)
}

package common

import (
	"context"
	"idresearch-web/domains"
	"idresearch-web/models"
	"strings"

	"github.com/gofiber/fiber/v2"

	"github.com/gofiber/fiber/v2/middleware/cors"
)

const (
	USER_CLAIMS_TOKEN = "USER_CLAIMS_TOKEN"
)

func Cors(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))
}

func AuthJWT(ctx *fiber.Ctx) error {
	headers := ctx.GetReqHeaders()

	authToken := strings.Split(headers["Authorization"], " ")
	if len(authToken) < 2 || authToken[0] != "Bearer" {
		return ctx.Status(422).JSON(&models.BaseResponse{
			Message: "Missing Authorization",
			Data:    nil,
		})
	}

	valid, claims, err := Validate(authToken[1])
	if !valid || err != nil {
		return ctx.Status(422).JSON(&models.BaseResponse{
			Message: "Unauthorized",
			Data:    nil,
		})

	}

	userTokenClaims := &domains.User{
		FullName:      claims["full_name"].(string),
		Email:         claims["email"].(string),
		Avatar:        claims["avatar"].(string),
		ID:            claims["user_id"].(string),
		PremiumMember: claims["premium_member"].(bool),
	}

	ctx.SetUserContext(context.WithValue(ctx.UserContext(), USER_CLAIMS_TOKEN, userTokenClaims))

	return ctx.Next()
}

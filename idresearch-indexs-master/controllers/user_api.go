package controllers

import (
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/models"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type UserAPIController struct {
	userUseCase domains.IUserUseCase
}

func NewUserAPIController(userUsecase domains.IUserUseCase) UserAPIController {
	return UserAPIController{
		userUseCase: userUsecase,
	}
}

func (c *UserAPIController) GetGoogleUser(ctx *fiber.Ctx) error {
	var reqAuth models.OauthGoogleReq

	err := ctx.BodyParser(&reqAuth)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	authToken, err := c.userUseCase.LoginOauthGoogle(ctx.UserContext(), reqAuth.Email, reqAuth.Token, ctx.IP())
	log.Println(err)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Auth succesed",
		Data:    authToken,
	})

}

func (c *UserAPIController) GetAllUser(ctx *fiber.Ctx) error {

	users, err := c.userUseCase.GetAllUser(ctx.UserContext())
	log.Println(err)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Auth succesed",
		Data:    users,
	})

}

func (c *UserAPIController) SetRoleUser(ctx *fiber.Ctx) error {
	var reqAuth models.SetRoleReq
	userID := ctx.Params("id", "")

	err := ctx.BodyParser(&reqAuth)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	err = c.userUseCase.ChangeRoleUser(ctx.UserContext(), reqAuth.Role, userID)
	log.Println(err)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Auth succesed",
		Data:    nil,
	})

}

func (c *UserAPIController) RefreshToken(ctx *fiber.Ctx) error {
	authToken := ctx.Query("token", "")

	token, err := c.userUseCase.RefreshToken(ctx.UserContext(), authToken)
	log.Println(err)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Auth succesed",
		Data:    token,
	})

}

func (c *UserAPIController) IsUserPremium(ctx *fiber.Ctx) error {
	userId := ctx.Query("email", "")

	token, err := c.userUseCase.IsUserPremium(ctx.UserContext(), userId)
	log.Println(err)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Auth succesed",
		Data:    token,
	})

}

func (c *UserAPIController) SetUserPremium(ctx *fiber.Ctx) error {
	log.Println("ngeset")
	userId := ctx.Query("email", "")
	activeStatus := ctx.Query("active", "false")

	activeStatusBool, err := strconv.ParseBool(activeStatus)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	log.Println(activeStatus, activeStatusBool)

	err = c.userUseCase.SetUserPremium(ctx.UserContext(), userId, activeStatusBool)
	log.Println(err)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request (2)",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Auth succesed",
		Data:    nil,
	})

}

func (ctrl *UserAPIController) Start(app *fiber.App) {
	app.Post("/v1/auth/oauth/google", ctrl.GetGoogleUser)
	app.Get("/v1/users", ctrl.GetAllUser)
	app.Post("/v1/users/:id", ctrl.SetRoleUser)
	app.Get("/v1/auth/refresh", ctrl.RefreshToken)
	app.Get("/v1/users/premium", common.AuthJWT, ctrl.IsUserPremium)
	app.Post("/v1/premium", common.AuthJWT, ctrl.SetUserPremium)
}

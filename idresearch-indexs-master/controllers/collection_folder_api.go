package controllers

import (
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

type CollectionFolderAPIController struct {
	collectionUsecase domains.ICollectionFolderUseCase
}

func NewCollectionFolderAPIController(collectionUsecase domains.ICollectionFolderUseCase) CollectionFolderAPIController {
	return CollectionFolderAPIController{
		collectionUsecase: collectionUsecase,
	}
}

func (ctrl *CollectionFolderAPIController) GetAllCollectionFoldersByUser(ctx *fiber.Ctx) error {
	folders, err := ctrl.collectionUsecase.GetCollectionFolderByUser(ctx.UserContext())
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data:    folders,
	})

}

func (ctrl *CollectionFolderAPIController) CreateCollectionFolders(ctx *fiber.Ctx) error {

	var reqBody models.CreateFolderCollectionReq
	err := ctx.BodyParser(&reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	err = ctrl.collectionUsecase.CreateFolder(ctx.UserContext(), domains.CollectionFolder{
		Name:        reqBody.Title,
		Description: reqBody.Description,
		IsPublic:    reqBody.IsPublic,
	})
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

func (ctrl *CollectionFolderAPIController) SaveCollection(ctx *fiber.Ctx) error {

	var reqBody domains.CollectionPayload
	err := ctx.BodyParser(&reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	reqBody.FolderID = ctx.Params("folder")

	err = ctrl.collectionUsecase.SaveCollectionToFolder(ctx.UserContext(), reqBody)
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

func (ctrl *CollectionFolderAPIController) DeleteCollectionFolder(ctx *fiber.Ctx) error {

	folderID := ctx.Params("folder")
	log.Println(folderID)

	err := ctrl.collectionUsecase.DeleteCollectionFolder(ctx.UserContext(), folderID)
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
func (ctrl *CollectionFolderAPIController) GetAllCollectionFolders(ctx *fiber.Ctx) error {

	folderID := ctx.Params("folder")
	log.Println(folderID)

	collections, err := ctrl.collectionUsecase.GetAllCollectionFromFolder(ctx.UserContext(), folderID)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "success",
		Data:    collections,
	})

}

func (ctrl *CollectionFolderAPIController) DeleteCollection(ctx *fiber.Ctx) error {

	collectionID := ctx.Params("collection_id")

	err := ctrl.collectionUsecase.DeleteCollection(ctx.UserContext(), collectionID)
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

func (ctrl *CollectionFolderAPIController) Start(app *fiber.App) {
	app.Get("/v1/collections", common.AuthJWT, ctrl.GetAllCollectionFoldersByUser)
	app.Post("/v1/collections", common.AuthJWT, ctrl.CreateCollectionFolders)
	app.Post("/v1/collections/:folder", common.AuthJWT, ctrl.SaveCollection)

	app.Delete("/v1/collections/:folder", common.AuthJWT, ctrl.DeleteCollectionFolder)

	app.Get("/v1/collections/:folder", common.AuthJWT, ctrl.GetAllCollectionFolders)

	app.Delete("/v1/collections/data/:collection_id", common.AuthJWT, ctrl.DeleteCollection)

}

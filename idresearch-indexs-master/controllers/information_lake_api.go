package controllers

import (
	"fmt"
	"idresearch-web/domains"
	"idresearch-web/models"
	"math"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type InformationAPIController struct {
	informationLakeUseCase domains.IinformationLakeUseCase
}

func NewInformationAPIController(informationLakeUsecase domains.IinformationLakeUseCase) InformationAPIController {
	return InformationAPIController{
		informationLakeUseCase: informationLakeUsecase,
	}
}

func (ctrl *InformationAPIController) AddInformation(ctx *fiber.Ctx) error {
	var reqBody domains.InformationLake
	err := ctx.BodyParser(&reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	err = ctrl.informationLakeUseCase.IngestInformation(ctx.UserContext(), reqBody)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    nil,
	})
}

func (ctrl *InformationAPIController) GetInformation(ctx *fiber.Ctx) error {

	anyYearsParam, err := strconv.ParseBool(ctx.Query("any_years", "false"))
	anyTopicParam, err := strconv.ParseBool(ctx.Query("any_topics", "false"))
	topicIdParam := ctx.Query("topic_id", "")
	startYearParam, err := strconv.Atoi(ctx.Query("start_year", "0"))
	endYearParam, err := strconv.Atoi(ctx.Query("end_year", "5010"))
	daerahLevel, err := strconv.Atoi(ctx.Query("daerah_level", "1"))
	daerahLabel := ctx.Query("daerah_label", "")
	daerahCode, err := strconv.Atoi(ctx.Query("daerah_code", "0"))
	page, err := strconv.Atoi(ctx.Query("page", "1"))
	keyword := ctx.Query("keyword", "")
	dataSource := ctx.Query("source", "all")

	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	filter := domains.InformationDataFilter{
		AnyYears:   anyYearsParam,
		AnyTopic:   anyTopicParam,
		YearStart:  startYearParam,
		YearEnd:    endYearParam,
		TopicID:    topicIdParam,
		Keyword:    keyword,
		DataSource: dataSource,
	}

	total, results, err := ctrl.informationLakeUseCase.GetInformationDataByDaerah(ctx.UserContext(), daerahLevel, daerahCode, page, daerahLabel, filter)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	var totalPage float64 = float64(total) / 20.0
	if total != 0 && totalPage == 0 {
		totalPage = 1
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data: &models.InformationLakePagingResponse{
			TotalDataFound: total,
			PageNow:        int64(page),
			TotalPage:      int64(math.Ceil(totalPage)),
			Lists:          results,
		},
	})
}

func (ctrl *InformationAPIController) GetLiteraturesAll(ctx *fiber.Ctx) error {
	page, err := strconv.Atoi(ctx.Query("page", "1"))
	perPage, err := strconv.Atoi(ctx.Query("per_page", "10"))
	keyword := ctx.Query("keyword", "")
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	results, total, err := ctrl.informationLakeUseCase.GetAllInformationLake(ctx.UserContext(), int64(page), int64(perPage), keyword)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data: &models.InformationLakePagingResponse{
			TotalDataFound: total,
			PageNow:        int64(page),
			TotalPage:      total / int64(perPage),
			Lists:          results,
		},
	})
}

func (ctrl *InformationAPIController) DeleteLiteratures(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	err := ctrl.informationLakeUseCase.Delete(ctx.UserContext(), id)
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    nil,
	})
}

func (ctrl *InformationAPIController) GetLiteraturesSourceStats(ctx *fiber.Ctx) error {
	stats, err := ctrl.informationLakeUseCase.GetSourceLiteraturesStats(ctx.UserContext())
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    stats,
	})
}

func (ctrl *InformationAPIController) GetSCrapedStats(ctx *fiber.Ctx) error {
	stats, err := ctrl.informationLakeUseCase.GetScrapedStats(ctx.UserContext())
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}

	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    stats,
	})
}

func (ctrl *InformationAPIController) GetSearchList(ctx *fiber.Ctx) error {

	result, err := ctrl.informationLakeUseCase.GetSmartSearch(ctx.UserContext(), ctx.Query("keyword", ""))
	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    err.Error(),
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    result,
	})
}

func (ctrl *InformationAPIController) GetGeojson(ctx *fiber.Ctx) error {

	level, err := ctx.ParamsInt("level", 0)
	id, err := ctx.ParamsInt("id", 0)
	fmt.Println("parameter", level, id)

	result, err := ctrl.informationLakeUseCase.GetGeojson(ctx.UserContext(), level, id)

	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    id,
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    result,
	})
}

func (ctrl *InformationAPIController) GetCitation(ctx *fiber.Ctx) error {

	articleId := ctx.Params("id", "")

	result, err := ctrl.informationLakeUseCase.GetCitation(ctx.UserContext(), articleId)

	if err != nil {
		return ctx.Status(400).JSON(&models.BaseResponse{
			Message: "Bad Request",
			Data:    articleId,
		})
	}
	return ctx.Status(200).JSON(&models.BaseResponse{
		Message: "Success",
		Data:    result,
	})
}

func (ctrl *InformationAPIController) Start(app *fiber.App) {
	app.Post("/v1/informations", ctrl.AddInformation)
	app.Get("/v1/informations", ctrl.GetInformation)
	app.Get("/v1/literatures", ctrl.GetLiteraturesAll)
	app.Delete("/v1/literatures/:id", ctrl.DeleteLiteratures)
	app.Get("/v1/literatures/source/stats", ctrl.GetLiteraturesSourceStats)
	app.Get("/v1/literatures/scraped/stats", ctrl.GetSCrapedStats)
	app.Get("/v1/search", ctrl.GetSearchList)
	app.Get("/v1/geojson/:level/:id", ctrl.GetGeojson)
	app.Get("/v1/tools/citation/:id", ctrl.GetCitation)
}

/*

title :

// MLA
Ward, Patrick J., et al. "Governance of flood risk management in a time of climate change: the cases of Jakarta and Rotterdam." Environmental Politics 22.3 (2013): 518-536.

{{author_name}}. "{{title}}." {{journal}} {{volume}}.{{issue}} ({{year}}): {{pages}}.


// APA
Ward, P. J., Pauw, W. P., Van Buuren, M. W., & Marfai, M. A. (2013). Governance of flood risk management in a time of climate change: the cases of Jakarta and Rotterdam. Environmental Politics, 22(3), 518-536.


// Chicago
Ward, Patrick J., W. P. Pauw, M. W. Van Buuren, and Muh Aris Marfai. "Governance of flood risk management in a time of climate change: the cases of Jakarta and Rotterdam." Environmental Politics 22, no. 3 (2013): 518-536.

// Harvard
Ward, P.J., Pauw, W.P., Van Buuren, M.W. and Marfai, M.A., 2013. Governance of flood risk management in a time of climate change: the cases of Jakarta and Rotterdam. Environmental Politics, 22(3), pp.518-536.


// Vancouver
Ward PJ, Pauw WP, Van Buuren MW, Marfai MA. Governance of flood risk management in a time of climate change: the cases of Jakarta and Rotterdam. Environmental Politics. 2013 May 1;22(3):518-36.


// BIBTEXT
@article{budiyono2016river,
  title={River flood risk in Jakarta under scenarios of future change},
  author={Budiyono, Yus and Aerts, Jeroen CJH and Tollenaar, Daniel and Ward, Philip J},
  journal={Natural hazards and earth system sciences},
  volume={16},
  number={3},
  pages={757--774},
  year={2016},
  publisher={Copernicus GmbH}
}


// ENDNOTE
%0 Journal Article
%T Kajian Pengendalian Banjir Sungai Kera Kabupaten Wajo
%A Latif, Abd
%A Musa, Ratna
%A Mallombassi, Ali
%J Jurnal Konstruksi: Teknik, Infrastruktur dan Sains
%V 1
%N 4
%P 37-48
%D 2022


// RIS
TY  - BOOK
T1  - Rekayasa dan manajemen banjir kota
A1  - Kodoatie, Robert J
SN  - 9792934545
Y1  - 2021
PB  - Penerbit Andi
ER  -



*/

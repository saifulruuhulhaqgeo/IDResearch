package models

import "idresearch-web/domains"

type BaseResponse struct {
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
}

type InformationLakePagingResponse struct {
	TotalDataFound int64                     `json:"total_found"`
	PageNow        int64                     `json:"page_now"`
	TotalPage      int64                     `json:"total_page"`
	Lists          []domains.InformationLake `json:"lists"`
}

type TopicPagingResponse struct {
	TotalDataFound int64           `json:"total_found"`
	PageNow        int64           `json:"page_now"`
	TotalPage      int64           `json:"total_page"`
	Lists          []domains.Topic `json:"lists"`
}

package domains

import "context"

type GoogleNews struct {
	Date  string `json:"date"`
	Desc  string `json:"desc"`
	Img   string `json:"img"`
	Link  string `json:"link"`
	Site  string `json:"site"`
	Title string `json:"title"`
}

type INewsDataRepository interface {
	GetGoogleNewsFromDaerah(ctx context.Context, daerah string) (news []GoogleNews, err error)
	AddGoogleNewsCache(ctx context.Context, daerah string, news []GoogleNews) (err error)
}

type INewsDataUseCase interface {
	GetGoogleNewsFromDaerah(ctx context.Context, daerah string) (news []GoogleNews, err error)
}

package usecases

import (
	"context"
	"idresearch-web/domains"
)

type NewsDataUseCase struct {
	newsDataRepository domains.INewsDataRepository
	traceName          string
}

func NewNewsDataUseCase(newsDataRepository domains.INewsDataRepository) domains.INewsDataUseCase {
	return &NewsDataUseCase{
		newsDataRepository: newsDataRepository,
		traceName:          "google_news_data",
	}
}

func (u *NewsDataUseCase) GetGoogleNewsFromDaerah(ctx context.Context, daerah string) (news []domains.GoogleNews, err error) {
	return u.newsDataRepository.GetGoogleNewsFromDaerah(ctx, daerah)
}

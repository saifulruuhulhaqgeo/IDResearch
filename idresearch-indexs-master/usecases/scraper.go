package usecases

import (
	"context"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"log"
	"time"
)

type ScraperUseCase struct {
	scraperRepository domains.IScraperRepository
	dlm               common.DLM
}

func NewScraperUseCase(scraperRepository domains.IScraperRepository, dlm common.DLM) domains.IScraperUseCase {
	return &ScraperUseCase{
		scraperRepository: scraperRepository,
		dlm:               dlm,
	}
}

func (u *ScraperUseCase) GetScraperParameter(ctx context.Context, agent domains.ScraperAgent) (param domains.ScraperParameter, err error) {
	log.Println("generating param for scraper label", agent.Label)
	topic, daerah, daerahLevel, err := u.scraperRepository.GetDaerahAndTopic(ctx)
	if err != nil {
		return
	}
	param = domains.ScraperParameter{
		DaerahLabel: daerah.DaerahName,
		DaerahLevel: daerahLevel,
		Topic:       topic.TopicName,
		TopicID:     topic.TopicID.String(),
		DaerahCode:  daerah.DaerahCode,
	}

	log.Println("UC Scraper param", param)
	if err = u.dlm.Lock(fmt.Sprintf("%d#%s#%s", param.DaerahLevel, param.DaerahLabel, param.Topic), time.Minute*5); err != nil {
		log.Println("parameter locked")
		return
	}

	return
}

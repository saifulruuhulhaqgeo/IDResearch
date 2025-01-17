package usecases

import (
	"context"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"strings"
)

type InformationLakeUseCase struct {
	informationLakeRepo domains.IinformationLakeRepository
	topicRepository     domains.ITopicDataRepository
	dlm                 common.DLM
}

func NewInformationUseCase(informationLakeRepo domains.IinformationLakeRepository, topicRepository domains.ITopicDataRepository, dlm common.DLM) domains.IinformationLakeUseCase {
	return &InformationLakeUseCase{
		informationLakeRepo: informationLakeRepo,
		dlm:                 dlm,
		topicRepository:     topicRepository,
	}
}

func (r *InformationLakeUseCase) GetInformationDataByDaerah(ctx context.Context, daerahLevel, daerahCode, page int, daerahLabel string, filter domains.InformationDataFilter) (total int64, informations []domains.InformationLake, err error) {
	page--
	limit := 20
	offset := page * 20

	fmt.Println("GET PAGING", offset, limit)
	total, internalData, err := r.informationLakeRepo.GetInformationDataByDaerah(ctx, daerahLevel, daerahCode, offset, limit, filter)
	informations = append(informations, internalData...)
	return
}

func (r *InformationLakeUseCase) IngestInformation(ctx context.Context, info domains.InformationLake) error {

	err := r.informationLakeRepo.IngestInformation(ctx, info)
	if err != nil {
		return err
	}
	r.dlm.Unlock(fmt.Sprintf("%d#%s#%s", info.DaerahLevel, info.DaerahLabel, info.TopikName))
	return r.informationLakeRepo.AddCountInformationData(ctx, info)
}

func (r *InformationLakeUseCase) GetAllInformationLake(ctx context.Context, page, limitPerpage int64, keyword string) (literatures []domains.InformationLake, totalAll int64, err error) {
	page--
	offset := limitPerpage * page
	limit := limitPerpage

	literatures, err = r.informationLakeRepo.GetAllInformationLake(ctx, offset, limit, keyword)
	totalAll, err = r.informationLakeRepo.GetTotalInformationLake(ctx, keyword)
	return
}

func (r *InformationLakeUseCase) Delete(ctx context.Context, id string) (err error) {
	err = r.informationLakeRepo.Delete(ctx, id)
	return
}

func (r *InformationLakeUseCase) GetSourceLiteraturesStats(ctx context.Context) (stats []domains.SourceLiterature, err error) {
	stats, err = r.informationLakeRepo.GetSourceLiteraturesStats(ctx)
	return
}

func (r *InformationLakeUseCase) GetScrapedStats(ctx context.Context) (stats domains.ScrapedStats, err error) {
	stats, err = r.informationLakeRepo.GetScrapedStats(ctx)
	return
}

func (r *InformationLakeUseCase) GetGeojson(ctx context.Context, daerahLevel, daerahCode int) (result []domains.Provinsis, err error) {
	return r.informationLakeRepo.GetGeojson(ctx, daerahLevel, daerahCode)
}

func (r *InformationLakeUseCase) GetSmartSearch(ctx context.Context, keyword string) (result domains.SearchList, err error) {
	topics, err := r.topicRepository.GetAllTopicTable(ctx, 0, 100, keyword)
	if err != nil {
		return
	}
	result.Topic = topics

	result.Keyword = append(result.Keyword, domains.SearchListKeyword{
		Label: keyword,
	})

	keywords, err := r.informationLakeRepo.GetKeywordRecommendation(ctx, keyword)
	if err != nil {
		return
	}
	result.Keyword = append(result.Keyword, keywords...)

	daerahRecommendation, err := r.informationLakeRepo.GetDaerahRecommendation(ctx, keyword)
	if err != nil {
		return
	}
	result.Daerah = daerahRecommendation
	return
}

func (r *InformationLakeUseCase) GetCitation(ctx context.Context, articleId string) (citations domains.Citation, err error) {

	result, err := r.informationLakeRepo.GetInformationLakeByID(ctx, articleId)
	if err != nil {
		return
	}

	authors := result.Author
	authorsEtalia := ""
	authorsSplited := strings.Split(authors, ",")
	if len(authorsSplited) > 2 {
		authorsEtalia = authorsSplited[0] + ", " + authorsSplited[1] + ", et al."
	}

	// MLA
	citations.MLA = fmt.Sprintf(`%s "%s" (%d).`, authorsEtalia, result.Title, result.Year)

	// APA
	citations.APA = fmt.Sprintf(`%s (%d). %s.`, authors, result.Year, result.Title)

	// Chicago
	citations.Chicago = fmt.Sprintf(`(%s). "%s" (%d).`, authors, result.Title, result.Year)

	// Harvard
	citations.Harvard = fmt.Sprintf(`%s., %d. %s.`, authors, result.Year, result.Title)

	// BibText
	citations.BibTexT = fmt.Sprintf(`@article{%s%d%s,
  title={%s},
  author={%s},
  journal={},
  volume={},
  number={},
  pages={},
  year={%d},
  publisher={}
}`, authorsSplited[0], result.Year, result.Title, result.Title, result.Author, result.Year)

	return

}

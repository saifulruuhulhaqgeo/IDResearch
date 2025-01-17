package usecases

import (
	"context"
	"idresearch-web/domains"
	"time"
)

type TopicDataUseCase struct {
	topicRepository domains.ITopicDataRepository
	lakeRepo        domains.IinformationLakeRepository
}

func NewTopicDataUseCase(topicRepository domains.ITopicDataRepository, lakeRepo domains.IinformationLakeRepository) domains.ITopicDataUseCase {
	return &TopicDataUseCase{
		topicRepository: topicRepository,
		lakeRepo:        lakeRepo,
	}
}

func (u *TopicDataUseCase) GetAllTopic(ctx context.Context, daerahCode int) (topics []domains.Topic, err error) {
	topics, err = u.topicRepository.GetAllTopic(ctx, daerahCode)
	return
}

func (u *TopicDataUseCase) GetAllTopicTable(ctx context.Context, page, perPage int64, keyword string) (topics []domains.Topic, total int64, err error) {
	page--
	offset := perPage * page
	limit := perPage

	topics, err = u.topicRepository.GetAllTopicTable(ctx, offset, limit, keyword)
	total, err = u.topicRepository.GetTotalTopicTable(ctx, keyword)
	return
}
func (u *TopicDataUseCase) CreateTopic(ctx context.Context, topic domains.Topic) (err error) {
	topic.CreatedAt = time.Now()
	err = u.topicRepository.CreateTopic(ctx, topic)
	return
}
func (u *TopicDataUseCase) UpdateTopic(ctx context.Context, topic domains.Topic) (err error) {
	err = u.topicRepository.UpdateTopic(ctx, topic)
	return
}
func (u *TopicDataUseCase) Delete(ctx context.Context, id string) (err error) {
	err = u.topicRepository.Delete(ctx, id)
	err = u.lakeRepo.UpdateTopicToUndefined(ctx, id)
	return
}

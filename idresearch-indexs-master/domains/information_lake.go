package domains

import (
	"context"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type TotalCollectedData struct {
	Total int64 `gorm:"column:total"`
}

type InformationLake struct {
	ID          uuid.UUID      `json:"id,omitempty" gorm:"column:id"`
	Title       string         `json:"title" gorm:"column:title"`
	Description string         `json:"description" gorm:"column:description"`
	Abstract    string         `json:"abstract" gorm:"column:abstract"`
	Author      string         `json:"author" gorm:"column:author"`
	Year        int            `json:"year" gorm:"column:year"`
	DaerahLabel string         `json:"daerah_label" gorm:"column:daerah_label"`
	DaerahLevel int            `json:"daerah_level" gorm:"column:daerah_level"`
	DaerahCode  int            `json:"daerah_code" gorm:"column:daerah_code"`
	TopikID     uuid.UUID      `json:"topik_id" gorm:"column:topik_id"`
	Links       pq.StringArray `json:"links" gorm:"column:links;type:text[]"`
	Source      string         `json:"source" gorm:"column:source"`
	TopikName   string         `json:"topic_name" gorm:"->;column:topic_name"`
	Stats       ScraperAgent   `json:"stats" gorm:"-:all"`
}

type ScopusSearchResult struct {
	SearchResults struct {
		Entry []struct {
			Fa   string `json:"@_fa,omitempty"`
			Link []struct {
				Fa   string `json:"@_fa,omitempty"`
				Ref  string `json:"@ref,omitempty"`
				Href string `json:"@href,omitempty"`
			} `json:"link,omitempty"`
			PrismURL              string `json:"prism:url,omitempty"`
			DcIdentifier          string `json:"dc:identifier,omitempty"`
			Eid                   string `json:"eid,omitempty"`
			DcTitle               string `json:"dc:title,omitempty"`
			DcCreator             string `json:"dc:creator,omitempty"`
			PrismPublicationName  string `json:"prism:publicationName,omitempty"`
			PrismIssn             string `json:"prism:issn,omitempty"`
			PrismEIssn            string `json:"prism:eIssn,omitempty"`
			PrismVolume           string `json:"prism:volume,omitempty"`
			PrismIssueIdentifier  string `json:"prism:issueIdentifier,omitempty"`
			PrismCoverDate        string `json:"prism:coverDate,omitempty"`
			PrismCoverDisplayDate string `json:"prism:coverDisplayDate,omitempty"`
			PrismDoi              string `json:"prism:doi,omitempty"`
			CitedbyCount          string `json:"citedby-count,omitempty"`
			PrismAggregationType  string `json:"prism:aggregationType,omitempty"`
			Subtype               string `json:"subtype,omitempty"`
			SubtypeDescription    string `json:"subtypeDescription,omitempty"`
			ArticleNumber         string `json:"article-number,omitempty"`
			SourceID              string `json:"source-id,omitempty"`
			Openaccess            string `json:"openaccess,omitempty"`
			OpenaccessFlag        bool   `json:"openaccessFlag,omitempty"`
		} `json:"entry,omitempty"`
	} `json:"search-results,omitempty"`
}

type InformationDataFilter struct {
	YearStart       int    `json:"year_start"`
	YearEnd         int    `json:"year_end"`
	AnyYears        bool   `json:"any_years"`
	TopicID         string `json:"topic_id"`
	AnyTopic        bool   `json:"any_topic"`
	Keyword         string `json:"keyword"`
	DataSource      string `json:"source"`
	KeywordOverride string `json:"keyword_override"`
}

type SourceLiterature struct {
	Name  string `gorm:"column:name"`
	Total string `gorm:"column:total"`
}

type ScrapedStats struct {
	Daerah  string `gorm:"column:daerah"`
	Topik   string `gorm:"column:topic"`
	Scraped string `gorm:"column:scraped"`
}

type IinformationLakeRepository interface {
	IngestInformation(ctx context.Context, info InformationLake) error
	AddCountInformationData(ctx context.Context, info InformationLake) error
	GetInformationDataByDaerah(ctx context.Context, daerahLevel, daerahCode, offset, limit int, filter InformationDataFilter) (total int64, informations []InformationLake, err error)
	GetInformationDataFromScopusAPI(ctx context.Context, daerahLevel int, daerahLabel string) (informations []InformationLake, err error)

	GetAllInformationLake(ctx context.Context, offset, limin int64, keyword string) (literatures []InformationLake, err error)
	GetTotalInformationLake(ctx context.Context, keyword string) (total int64, err error)
	Delete(ctx context.Context, id string) (err error)

	UpdateTopicToUndefined(ctx context.Context, topicID string) (err error)
	GetSourceLiteraturesStats(ctx context.Context) (stats []SourceLiterature, err error)
	GetScrapedStats(ctx context.Context) (stats ScrapedStats, err error)
	GetKeywordRecommendation(ctx context.Context, keyword string) (result []SearchListKeyword, err error)
	GetDaerahRecommendation(ctx context.Context, keyword string) (result []SearchListDaerah, err error)
	GetGeojson(ctx context.Context, daerahLevel, daerahCode int) (result []Provinsis, err error)
	GetInformationLakeByID(ctx context.Context, articleId string) (result InformationLake, err error)
}

type IinformationLakeUseCase interface {
	IngestInformation(ctx context.Context, info InformationLake) error
	GetInformationDataByDaerah(ctx context.Context, daerahLevel, daerahCode, page int, daerahLabel string, filter InformationDataFilter) (total int64, informations []InformationLake, err error)
	GetAllInformationLake(ctx context.Context, page, limitPerpage int64, keyword string) (literatures []InformationLake, totalAll int64, err error)
	Delete(ctx context.Context, id string) (err error)
	GetSourceLiteraturesStats(ctx context.Context) (stats []SourceLiterature, err error)
	GetScrapedStats(ctx context.Context) (stats ScrapedStats, err error)
	GetSmartSearch(ctx context.Context, keyword string) (result SearchList, err error)
	GetGeojson(ctx context.Context, daerahLevel, daerahCode int) (result []Provinsis, err error)
	GetCitation(ctx context.Context, articleId string) (citations Citation, err error)
}

type SearchListTopic struct {
	Label string `json:"label"`
	Count string `json:"count"`
}

type SearchListKeyword struct {
	Label string `json:"label" gorm:"column:label"`
}

type SearchListDaerah struct {
	Label       string `json:"label"`
	DaerahCode  string `json:"daerah_code"`
	DaerahLevel string `json:"daerah_level"`
}

type SearchList struct {
	Topic   []Topic             `json:"topic"`
	Keyword []SearchListKeyword `json:"keyword"`
	Daerah  []SearchListDaerah  `json:"daerah"`
}

type Citation struct {
	MLA       string `json:"MLA"`
	APA       string `json:"APA"`
	Chicago   string `json:"Chicago"`
	Harvard   string `json:"Harvard"`
	Hancouver string `json:"Hancouver"`
	BibTexT   string `json:"BibText"`
	EndNote   string `json:"Endnote"`
	Ris       string `json:"Ris"`
}

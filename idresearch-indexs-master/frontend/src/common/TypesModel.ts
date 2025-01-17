type AreaModalParam = {
  areaLevel: number;
  areaCode: number;
  areaLabel: string;
  keyword_override?: string;
};

type ResearchData = {
  author: string;
  daerah_code: number;
  daerah_label: string;
  daerah_level: number;
  description: string;
  id: string;
  links: Array<string>;
  source: string;
  title: string;
  topic_name: string;
  topik_id: string;
  year: number;
};

type NewsData = {
  link: string;
  title: string;
  site: string;
  date: string;
};

type ResearchFilter = {
  anyTopic: boolean;
  anyYear: boolean;
  startYear: number;
  endYear: number;
  topicId: string;
  dataSource: string;
};

type ResearchTopic = {
  name: string;
  id: string;
};

type CollectionPayload = {
  collectionType: string;
  collectionData: any;
};

type Topic = {
  id: string;
  name: string;
  description: string;
  total_informations: number;
};

type SearchTopicResult = {
  id: string;
  name: string;
  description: string;
  total_informations: string;
  created_at: string;
  search_count: number;
};

type SearchKeywordResult = {
  label: string;
};

type SearchDaerahResult = {
  label: string;
  daerah_code: string;
  daerah_level: string;
};

export type {
  AreaModalParam,
  ResearchFilter,
  ResearchData,
  NewsData,
  ResearchTopic,
  CollectionPayload,
  Topic,
  SearchTopicResult,
  SearchDaerahResult,
  SearchKeywordResult,
};

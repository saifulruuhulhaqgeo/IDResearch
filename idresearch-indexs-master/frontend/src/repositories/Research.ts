import axios from 'axios';
import {API_HOST} from '../common/Constant';
import {AreaModalParam, ResearchFilter, Topic} from '../common/TypesModel';

const getResearchData = async (
  page: number,
  areaParam: AreaModalParam,
  filter: ResearchFilter,
  keyword: string,
) => {
  const url = `${API_HOST}/v1/informations?daerah_label=${areaParam.areaLabel}&daerah_level=${areaParam.areaLevel}&daerah_code=${areaParam.areaCode}&page=${page}&any_years=${filter.anyYear}&any_topics=${filter.anyTopic}&topic_id=${filter.topicId}&start_year=${filter.startYear}&end_year=${filter.endYear}&keyword=${keyword}&source=${filter.dataSource}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getTerkiniData = async (areaParam: AreaModalParam) => {
  const url = `${API_HOST}/v1/news/google?q=${areaParam.areaLabel}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getAllTopic = async (areaCode = 0) => {
  const url = `${API_HOST}/v1/topics?daerah_code=${areaCode}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getAllLiteratures = async (
  page: number,
  perPage: number,
  keyword: string,
) => {
  const url = `${API_HOST}/v1/literatures?page=${page}&per_page=${perPage}&keyword=${keyword}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  };
  return axios(config);
};

const deleteLiteratures = async (id: string) => {
  const url = `${API_HOST}/v1/literatures/${id}`;

  var config = {
    method: 'DELETE',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  };
  return axios(config);
};

const getAllTableTopic = async (
  page: number,
  perPage: number,
  keyword: string,
) => {
  const url = `${API_HOST}/v1/topics/table?page=${page}&per_page=${perPage}&keyword=${keyword}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  };
  return axios(config);
};

const deleteTopik = async (id: string) => {
  const url = `${API_HOST}/v1/topics/${id}`;

  var config = {
    method: 'DELETE',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  };
  return axios(config);
};

const createTopik = async (topic: Topic) => {
  const url = `${API_HOST}/v1/topics`;

  var config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    data: topic,
  };
  return axios(config);
};

const editTopik = async (topic: Topic) => {
  const url = `${API_HOST}/v1/topics/${topic.id}`;

  var config = {
    method: 'PUT',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    data: topic,
  };
  return axios(config);
};

const getLiteraturesSourceStats = async () => {
  const url = `${API_HOST}/v1/literatures/source/stats`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getScrapedStats = async () => {
  const url = `${API_HOST}/v1/literatures/scraped/stats`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getCitation = async (articleId: string) => {
  const url = `${API_HOST}/v1/tools/citation/${articleId}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

export {
  getResearchData,
  getTerkiniData,
  getAllTopic,
  getAllLiteratures,
  deleteLiteratures,
  getAllTableTopic,
  deleteTopik,
  createTopik,
  editTopik,
  getScrapedStats,
  getLiteraturesSourceStats,
  getCitation,
};

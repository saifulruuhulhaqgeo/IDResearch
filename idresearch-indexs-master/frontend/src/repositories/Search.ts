import axios from 'axios';
import {API_HOST} from '../common/Constant';

const searchSmartSearch = async (keyword: string) => {
  const url = `${API_HOST}/v1/search?keyword=${keyword}`;
  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getGeoJson = async (level: number, daerahCode: number) => {
  const url = `${API_HOST}/v1/geojson/${level}/${daerahCode}`;
  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

export {searchSmartSearch, getGeoJson};

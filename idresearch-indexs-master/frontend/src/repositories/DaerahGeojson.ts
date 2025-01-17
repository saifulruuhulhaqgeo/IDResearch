import axios from 'axios';
import {LatLngBounds} from 'leaflet';
import {API_HOST} from '../common/Constant';

const getDaerahGeoJson = async (zoomLevel: number, bbox: LatLngBounds) => {
  const sw = bbox.getSouthWest();
  const ne = bbox.getNorthEast();

  const topicId = localStorage.getItem('topic_id') ?? '';
  const keyword = localStorage.getItem('keyword') ?? '';

  let level;
  if (zoomLevel <= 7) {
    console.log('provinsi level');
    level = 'provinsis';
  } else if (zoomLevel > 7 && zoomLevel <= 10) {
    console.log('kabupaten level');
    level = 'kabupatens';
  } else if (zoomLevel > 10 && zoomLevel <= 14) {
    console.log('kecamatan level');
    level = 'kecamatans';
  } else {
    console.log('desa alevel');
    level = 'desas';
  }
  const url = `${API_HOST}/v1/${level}/geojson?west=${sw.lng}&south=${sw.lat}&east=${ne.lng}&north=${ne.lat}&topic_id=${topicId}&keyword=${keyword}`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

const getProvinsiStats = () => {
  const url = `${API_HOST}/v1/provinsis/stats`;

  var config = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config);
};

export {getDaerahGeoJson, getProvinsiStats};

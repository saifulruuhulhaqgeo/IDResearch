import axios from 'axios';
import {API_HOST} from '../common/Constant';
import {CollectionPayload} from '../common/TypesModel';

const getMyFolders = async () => {
  const url = `${API_HOST}/v1/collections`;

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

const createCollectionFolder = async (
  title: string,
  description: string,
  isPublic: boolean,
) => {
  const url = `${API_HOST}/v1/collections`;

  var config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    data: {
      title: title,
      description: description,
      is_public: isPublic,
    },
  };
  return axios(config);
};

const saveCollectionToFolder = async (
  payload: CollectionPayload,
  folderId: string,
) => {
  const url = `${API_HOST}/v1/collections/${folderId}`;

  var config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    data: {
      information_type: payload.collectionType,
      information_payload: JSON.stringify(payload.collectionData),
    },
  };
  return axios(config);
};

const deleteCollectionToFolder = async (folderId: string) => {
  const url = `${API_HOST}/v1/collections/${folderId}`;

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

const getCollectionFromFolder = async (folderId: string) => {
  const url = `${API_HOST}/v1/collections/${folderId}`;

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

const deleteCollectionFromFolder = async (
  collectionId: string,
) => {
    const url = `${API_HOST}/v1/collections/data/${collectionId}`;

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

export {
  getMyFolders,
  createCollectionFolder,
  saveCollectionToFolder,
  deleteCollectionToFolder,
  getCollectionFromFolder,
  deleteCollectionFromFolder,
};

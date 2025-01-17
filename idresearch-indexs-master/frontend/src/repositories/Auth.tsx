import axios from 'axios';
import {API_HOST} from '../common/Constant';

const authLoginGoogle = async (payload: any) => {
  const url = `${API_HOST}/v1/auth/oauth/google`;
  var config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  };
  return axios(config);
};

const changeRole = async (userId: string, role: string) => {
  const url = `${API_HOST}/v1/users/${userId}`;
  var config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    data: {
      role: role,
    },
  };
  return axios(config);
};

const getAllUser = async () => {
  const url = `${API_HOST}/v1/users`;
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

const getIsPremiumUser = async (email: string) => {
  const url = `${API_HOST}/v1/users/premium?email=${email}`;
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

const setUserIsPremium = async (email: string, isPremium: boolean) => {
  const url = `${API_HOST}/v1/premium?email=${email}&active=${isPremium}`;
  var config = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  };
  return axios(config);
};

export {
  authLoginGoogle,
  changeRole,
  getAllUser,
  getIsPremiumUser,
  setUserIsPremium,
};

import { DefaultApi } from './api';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.OB_BMS_URL || 'http://localhost:3000',
});

function setAcessToken(accessToken: string): void {
  axiosInstance.defaults.headers.common['x-access-token'] = `Bearer ${accessToken}`;
}

function setBaseUrl(string: string): void {
  axiosInstance.defaults.baseURL = string;
}

const client = new DefaultApi(undefined, undefined, axiosInstance);

export { client, axiosInstance, setAcessToken, setBaseUrl };

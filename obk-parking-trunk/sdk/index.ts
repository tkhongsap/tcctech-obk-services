import { DefaultApi } from './api';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.OB_PARKING_URL || 'http://localhost:3000',
});

function setAcessToken(accessToken: string): void {
  axiosInstance.defaults.headers.common[
    'x-access-token'
  ] = `Bearer ${accessToken}`;
}

function setBaseUrl(url: string): void {
  axiosInstance.defaults.baseURL = url;
}

// always set TraceId before calling any function
function setTraceId(traceId: string): void {
  axiosInstance.defaults.headers.common['x-trace-id'] = traceId;
}

const client = new DefaultApi(undefined, undefined, axiosInstance);

export { client, axiosInstance, setAcessToken, setBaseUrl, setTraceId };

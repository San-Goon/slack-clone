import axiosOrigin from 'axios';
import { CONFIG } from '../config';

const axios = axiosOrigin.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axios;

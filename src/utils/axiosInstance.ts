// utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://control.coachingzona.uz/api/v1', // Базовый URL вашего API
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

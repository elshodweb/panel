import axios from "axios";

// Функция для динамического получения токена из localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Создаем экземпляр axios
const axiosInstance = axios.create({
  baseURL: "https://control.coachingzona.uz/api/v1", // Базовый URL вашего API
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Добавляем интерсептор для автоматической установки токена в заголовки
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

// Функция для получения токена из localStorage
const getToken = (): string | null => {
  try {
    return localStorage?.getItem("token");
  } catch (error) {
    console.error("Ошибка при получении токена из localStorage:", error);
    return null;
  }
};

// Создаем экземпляр axios
const axiosInstance = axios.create({
  baseURL: "https://control.coachingzona.uz/api/v1", // Базовый URL API
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Добавляем интерсептор для установки токена
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {}; // Убедимся, что заголовки существуют
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Ошибка в запросе:", error);
    return Promise.reject(error);
  }
);

// Добавляем интерсептор для обработки ошибок ответа
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `Ошибка ${error.response.status}:`,
        error.response.data?.message || error.response.statusText
      );
    } else {
      console.error("Ошибка сети или сервера:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

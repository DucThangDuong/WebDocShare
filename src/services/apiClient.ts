const BASE_URL = import.meta.env.VITE_API_URL;
export class ApiError extends Error {
  status: number;
  data: object | undefined;

  constructor(status: number, message: string, data?: object) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/refresh-token")) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post(`${BASE_URL}/refresh-token`);

        const { accessToken: newAccessToken } = response.data;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string) => axiosInstance.get<T>(url).then((res) => res.data),
  post: <T>(url: string, data: object = {}) =>
    axiosInstance.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data: object) =>
    axiosInstance.put<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) =>
    axiosInstance.delete<T>(url).then((res) => res.data),
  postForm: <T>(url: string, data: FormData) =>
    axiosInstance
      .post<T>(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
};

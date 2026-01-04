import { apiClient } from "../services/apiClient";
import type { UserProfile } from "../interfaces/IStore";
export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const isLoggedIn = (): boolean => {
  const token = getToken();
  return !!token;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getMe = () => {
  return apiClient.get<UserProfile>("/me");
};

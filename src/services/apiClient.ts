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
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (response.status === 204) {
      return null as T;
    }
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      let errorMessage = errorBody.message;
      if (!errorMessage) {
        const errorsData = errorBody.errors || errorBody;
        if (typeof errorsData === "object" && errorsData !== null) {
          const firstValidationError = Object.values(errorsData)
            .flat()
            .find((item) => typeof item === "string");
          if (firstValidationError) {
            errorMessage = firstValidationError;
          }
        }
      }
      errorMessage = errorMessage || `Lỗi HTTP: ${response.status}`;
      throw new ApiError(response.status, errorMessage as string, errorBody);
    }
    return (await response.json()) as T;
  } catch (error: string | unknown) {
    console.error("API Error:", error);
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: object) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: object) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

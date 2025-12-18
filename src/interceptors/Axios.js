import axios from "axios";

const BASE_URL = "https://lotteryapi.arustu.com/api/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
api.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${BASE_URL}/Account/RefreshToken`,
          {
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          }
        );

        // Save new tokens
        sessionStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);

        // Update default headers
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

        // Retry failed request
        return api(error.config);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
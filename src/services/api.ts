import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT Access Token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle expired tokens and rotate them
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 403 Forbidden (our token expiry status) and request has not been retried
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Attempt to renew the access token using the refresh token
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data;

          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If token refresh fails, sign out the user
          console.error("Token refresh failed. Directing to login.", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login?expired=true";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

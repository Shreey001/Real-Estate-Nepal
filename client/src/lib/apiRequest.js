import axios from "axios";

const apiRequest = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiRequest.interceptors.request.use(
  (config) => {
    // We're using HttpOnly cookies for auth, so no need to set Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token (this uses the HttpOnly cookie)
        await apiRequest.post("/auth/refresh");

        // If we get here, the token was refreshed successfully
        // Retry the original request
        return apiRequest(originalRequest);
      } catch (refreshError) {
        // If refresh fails, handle gracefully
        console.error("Failed to refresh authentication", refreshError);

        // Clear user data from localStorage but don't redirect automatically
        // This prevents redirect loops
        localStorage.removeItem("user");

        // Only redirect if not already on login page
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiRequest;

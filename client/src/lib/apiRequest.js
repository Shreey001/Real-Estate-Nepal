import axios from "axios";

const apiRequest = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh attempts at once
let isRefreshing = false;
// Store pending requests
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
apiRequest.interceptors.request.use(
  (config) => {
    // Try to use token from localStorage if available (as fallback)
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiRequest(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Only attempt a refresh once, then redirect to login
        const response = await apiRequest.post("/auth/refresh");

        // Success - mark refreshing as complete
        isRefreshing = false;

        // Store token and process queue if provided
        if (response.data.accessToken) {
          const token = response.data.accessToken;
          localStorage.setItem("authToken", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          processQueue(null, token);
        } else {
          processQueue(new Error("No token in refresh response"), null);
        }

        // Retry the original request
        return apiRequest(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reset the flag and clear queue
        isRefreshing = false;
        processQueue(refreshError, null);

        // Clear user data
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        // Only redirect if not already on login or register page
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          // Redirect with a slight delay to avoid redirect loops
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }

        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default apiRequest;

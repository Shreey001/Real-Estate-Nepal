import axios from "axios";

const apiRequest = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api",
  withCredentials: true, // Still include credentials for cookies as backup
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

// Request interceptor - add token to every request
apiRequest.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // If token exists, add to headers
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

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops
      if (
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/validate")
      ) {
        // Clear auth data since refresh/login/validate fails
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        // Only redirect if not already on login or register page
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiRequest(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const token = localStorage.getItem("authToken");
        const response = await apiRequest.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Success - update token and retry
        isRefreshing = false;

        if (response.data.accessToken) {
          // Store new token
          localStorage.setItem("authToken", response.data.accessToken);

          // Update headers and process queue
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          processQueue(null, response.data.accessToken);

          // Retry the original request
          return apiRequest(originalRequest);
        } else {
          // No token in response
          processQueue(new Error("No token returned"), null);
          return Promise.reject(new Error("Authentication failed"));
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect
        isRefreshing = false;
        processQueue(refreshError, null);

        // Clear auth data
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        // Only redirect if not already on login or register page
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just pass through
    return Promise.reject(error);
  }
);

export default apiRequest;

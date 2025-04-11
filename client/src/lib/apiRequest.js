import axios from "axios";

const apiRequest = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-backend-url.vercel.app/api"
      : "http://localhost:4000/api",
  withCredentials: true,
});

export default apiRequest;

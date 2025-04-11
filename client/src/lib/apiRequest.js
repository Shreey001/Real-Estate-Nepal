import axios from "axios";

const apiRequest = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://real-estate-backend-indol.vercel.app/api"
      : "http://localhost:4000/api",
  withCredentials: true,
});

export default apiRequest;

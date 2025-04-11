import { createContext, useState, useEffect } from "react";
import apiRequest from "../lib/apiRequest";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const validateToken = async () => {
      if (token) {
        try {
          const response = await apiRequest.get("/auth/validate");
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error("Token validation failed:", error);
          // Clear storage on validation failure
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const updateUser = (data) => {
    setCurrentUser(data);
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const logout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setCurrentUser(null);
      // Clear cookies manually as well
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (window.location.hostname.includes(".vercel.app")) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

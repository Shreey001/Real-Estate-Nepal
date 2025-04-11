import { createContext, useState, useEffect } from "react";
import apiRequest from "../lib/apiRequest";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Try to validate with cookie-based auth first
        const response = await apiRequest.get("/auth/validate");
        setCurrentUser(response.data.user);

        // If we get here without error, store the user
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // Clear storage on validation failure
        localStorage.removeItem("user");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Only validate if we think we have a user
    if (localStorage.getItem("user")) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const updateUser = (data) => {
    setCurrentUser(data);
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all storage
      localStorage.removeItem("user");
      setCurrentUser(null);

      // Clear cookies manually as well
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear domain-specific cookies for Vercel
      if (window.location.hostname.includes(".vercel.app")) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;";
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=vercel.app;";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

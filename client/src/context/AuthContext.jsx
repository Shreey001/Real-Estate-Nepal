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
      // Only validate if we have a user in localStorage or a token
      if (!localStorage.getItem("user") && !localStorage.getItem("authToken")) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest.get("/auth/validate");
        // Update user data if validation succeeds
        if (response.data.user) {
          setCurrentUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          // Clear user data if validation returns invalid data
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // Clear storage on validation failure
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const updateUser = (data) => {
    setCurrentUser(data);
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
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
      localStorage.removeItem("authToken");
      setCurrentUser(null);

      // Clear cookies manually as well
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;";
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=vercel.app;";
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;";
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

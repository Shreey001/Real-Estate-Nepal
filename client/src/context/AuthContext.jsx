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
      // Only attempt validation if we have a token
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest.get("/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update user data if validation succeeds
        if (response.data?.user) {
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
      const token = localStorage.getItem("authToken");
      if (token) {
        await apiRequest.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all storage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

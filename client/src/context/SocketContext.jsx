import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_API_URL || "http://localhost:4000",
      {
        path: "/api/socket",
        addTrailingSlash: false,
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        secure: true,
      }
    );

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      // Emit new user event when user logs in
      socket.emit("newUser", currentUser.id);

      // Handle reconnection
      socket.io.on("reconnect", () => {
        console.log("Socket reconnected, re-registering user");
        socket.emit("newUser", currentUser.id);
      });

      return () => {
        socket.io.off("reconnect");
      };
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

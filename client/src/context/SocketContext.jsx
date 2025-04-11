import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      // Don't create socket connection if user is not authenticated
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

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
        auth: {
          token,
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (error.message === "xhr poll error") {
        console.log("Retrying with polling transport");
        socketInstance.io.opts.transports = ["polling"];
      }
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
      // Re-register user after successful connection
      socketInstance.emit("newUser", currentUser.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected us, try to reconnect
        socketInstance.connect();
      }
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [currentUser]);

  // No need for second useEffect since we're handling user registration in connect event

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

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
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("newUser", currentUser.id);

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        socket.off("connect");
        socket.off("connect_error");
      };
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: [
          "https://real-estate-nepal.vercel.app",
          "http://localhost:5173",
        ],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Authorization", "Cookie"],
      },
      transports: ["websocket", "polling"],
    });

    // Authentication middleware
    io.use((socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) {
          return next(new Error("Authentication token missing"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
      } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Authentication failed"));
      }
    });

    // Store online users
    let onlineUsers = [];

    const addUser = (userId, socketId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({ userId, socketId });
      console.log("User added to online users:", { userId, socketId });
      console.log("Current online users:", onlineUsers);
    };

    const removeUser = (socketId) => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
      console.log("User removed, current online users:", onlineUsers);
    };

    const getUser = (userId) => {
      return onlineUsers.find((user) => user.userId === userId);
    };

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id, "User ID:", socket.userId);

      socket.on("newUser", (userId) => {
        // Verify the userId matches the authenticated user
        if (userId === socket.userId) {
          addUser(userId, socket.id);
          io.emit("getOnlineUsers", onlineUsers);
        } else {
          console.error("User ID mismatch:", {
            providedId: userId,
            socketUserId: socket.userId,
          });
        }
      });

      socket.on(
        "sendMessage",
        ({ senderId, receiverId, message, conversationId }) => {
          // Verify the sender is the authenticated user
          if (senderId !== socket.userId) {
            console.error("Sender ID mismatch:", {
              providedId: senderId,
              socketUserId: socket.userId,
            });
            return;
          }

          const receiver = getUser(receiverId);
          if (receiver) {
            io.to(receiver.socketId).emit("getMessage", {
              senderId,
              message,
              conversationId,
              receiverId,
            });
          }
        }
      );

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        removeUser(socket.id);
        io.emit("getOnlineUsers", onlineUsers);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already running");
  }

  res.end();
}

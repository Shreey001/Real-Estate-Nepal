import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: [
          "https://real-estate-six-lyart-82.vercel.app",
          "http://localhost:5173",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    // Store online users
    let onlineUsers = [];

    const addUser = (userId, socketId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({ userId, socketId });
    };

    const removeUser = (socketId) => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (userId) => {
      return onlineUsers.find((user) => user.userId === userId);
    };

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("newUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getOnlineUsers", onlineUsers);
        console.log("Online users:", onlineUsers);
      });

      socket.on(
        "sendMessage",
        ({ senderId, receiverId, message, conversationId }) => {
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

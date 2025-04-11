import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: ["https://real-estate-nepal.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
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
  console.log("Socket is initialized");
  res.end();
};

export default SocketHandler;

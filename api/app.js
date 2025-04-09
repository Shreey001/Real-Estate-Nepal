import express from "express";
import cors from "cors";
import postRoutes from "./routes/post.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import testRoutes from "./routes/test.route.js";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/test", testRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000 ");
});

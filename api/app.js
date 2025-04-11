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

// Configure CORS to accept requests from both local and production origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173", // Local development frontend
  "https://real-estate-app-frontend.vercel.app", // Vercel deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

// For Vercel deployment, we export the configured app
export default app;

// Only start the server if not being deployed to Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(4000, () => {
    console.log("Server is running on port 4000 ");
  });
}

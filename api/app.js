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

// CORS configuration
app.use(
  cors({
    origin: [
      "https://real-estate-six-lyart-82.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/test", testRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

export default app;

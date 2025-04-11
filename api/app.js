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
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
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
  console.error("Express error:", err);
  if (!res.headersSent) {
    res.status(500).json({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
      timestamp: new Date().toISOString(),
    });
  }
});

// Handle 404
app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({
      error: "Not Found",
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
});

// For local development only
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;

import express from "express";
import cors from "cors";
import postRoutes from "./routes/post.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import testRoutes from "./routes/test.route.js";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";

// Initialize express app
const app = express();

// Basic request logging
app.use((req, res, next) => {
  console.log("[Express] Request:", {
    method: req.method,
    path: req.path || req.url,
    timestamp: new Date().toISOString(),
  });
  next();
});

// CORS configuration
app.use(
  cors({
    origin: [
      "https://real-estate-six-lyart-82.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Origin",
      "Accept",
    ],
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 200,
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root route handler
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Real Estate API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Health check with detailed response
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    headers: req.headers,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/test", testRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Express] Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path || req.url,
    method: req.method,
  });

  if (!res.headersSent) {
    res.status(500).json({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
      path: req.path || req.url,
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log("[Express] 404 Not Found:", {
    path: req.path || req.url,
    method: req.method,
  });

  if (!res.headersSent) {
    res.status(404).json({
      error: "Not Found",
      path: req.path || req.url,
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

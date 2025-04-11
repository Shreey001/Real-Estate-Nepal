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

// Basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error logging
const logError = (err) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

try {
  // Configure CORS to accept requests from both local and production origins
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "https://real-estate-six-lyart-82.vercel.app",
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

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Root route for testing
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Real Estate API is running",
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/messages", messageRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    logError(err);
    res.status(500).json({
      message: "Something broke!",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler - must be after all other routes
  app.use((req, res) => {
    console.log(`404 - Route not found: ${req.path}`);
    res.status(404).json({
      message: "Route not found",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  });
} catch (error) {
  logError(error);
  // Add a fallback error route
  app.use((req, res) => {
    res.status(500).json({
      message: "Server initialization failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      timestamp: new Date().toISOString(),
    });
  });
}

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

export default app;

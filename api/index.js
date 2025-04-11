import app from "./app.js";

// For Vercel serverless deployment
export default async function handler(req, res) {
  try {
    // Forward the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      message: "Serverless function error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
}

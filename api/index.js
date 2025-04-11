import app from "./app.js";

// For Vercel serverless deployment
export default async function handler(req, res) {
  try {
    // Ensure response is not sent yet
    if (!res.headersSent) {
      // Forward the request to the Express app
      await new Promise((resolve, reject) => {
        app(req, res, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  } catch (error) {
    console.error("Serverless function error:", error);
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
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
}

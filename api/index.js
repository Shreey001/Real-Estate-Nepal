import app from "./app.js";

// For Vercel serverless deployment
export default async function handler(req, res) {
  try {
    console.log("[Serverless] Request received:", {
      method: req.method,
      path: req.path || req.url,
      headers: req.headers,
    });

    // Check if app is properly imported
    if (!app || typeof app !== "function") {
      throw new Error("Express app not properly initialized");
    }

    // Ensure response is not sent yet
    if (!res.headersSent) {
      // Forward the request to the Express app
      await new Promise((resolve, reject) => {
        try {
          app(req, res, (err) => {
            if (err) {
              console.error("[Serverless] Middleware error:", err);
              reject(err);
            }
            resolve();
          });
        } catch (e) {
          console.error("[Serverless] Express handling error:", e);
          reject(e);
        }
      });
    }
  } catch (error) {
    console.error("[Serverless] Function error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Serverless function error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
        timestamp: new Date().toISOString(),
        path: req.path || req.url,
      });
    }
  }
}

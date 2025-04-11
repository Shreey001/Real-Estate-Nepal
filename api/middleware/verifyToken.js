import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // First check authorization header (preferred)
  let token;

  // Get token from Authorization header
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // If no token in Authorization header, try cookies as fallback
  if (!token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.userId = payload.userId;
    req.isAdmin = payload.isAdmin;

    next();
  });
};

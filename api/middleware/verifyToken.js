import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // First try to get token from cookies
  let token = req.cookies.token;

  // If no cookie token, check for Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    req.userId = payload.userId;

    next();
  });
};

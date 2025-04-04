import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = (req, res) => {
  console.log(req.userId);
  res.status(200).json({ message: "You are authenticated", user: req.userId });
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "You are not an admin" });
    }
  });
  res.status(200).json({ message: "You are an admin" });
};

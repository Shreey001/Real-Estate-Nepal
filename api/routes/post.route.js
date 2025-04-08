import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Create a modified version of verifyToken that doesn't require authentication
const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    next(); // Continue without setting userId
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    next(); // Continue without setting userId if token is invalid
  }
};

router.get("/", optionalAuth, getPosts);
router.get("/:id", verifyToken, getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;

import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteUser,
  getUser,
  getUsers,
  profilePosts,
  savePost,
  updateUser,
  getNotificationNumber,
  getAgents,
} from "../controllers/user.controller.js";

const router = express.Router();

// Public routes
router.get("/agents", getAgents); // Route for getting agents

// Protected routes
router.get("/", verifyToken, getUsers);
router.get("/profile/:id", verifyToken, getUser);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);
router.post("/save", verifyToken, savePost);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;

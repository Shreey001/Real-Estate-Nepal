import express from "express";
import {
  register,
  login,
  logout,
  validate,
  refresh,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/validate", validate);
router.post("/refresh", refresh);

export default router;

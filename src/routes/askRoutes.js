import express from "express";
import { askQuestion } from "../controllers/askController.js";
import { protect } from "../middleware/authMiddleware.js";
import { askLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();
router.post("/", protect, askLimiter, askQuestion);
export default router;
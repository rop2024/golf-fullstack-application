import express from "express";
import {
  submitScore,
  getUserScores,
  getAllScores
} from "../controllers/score.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/submit", authenticateToken, submitScore);
router.get("/my-scores", authenticateToken, getUserScores);
router.get("/all", authenticateToken, getAllScores);

export default router;
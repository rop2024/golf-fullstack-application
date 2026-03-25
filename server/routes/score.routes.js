import express from "express";
import {
  submitScore,
  getUserScores,
  getAllScores
} from "../controllers/score.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/submit", authenticateUser, submitScore);
router.get("/my-scores", authenticateUser, getUserScores);
router.get("/all", authenticateUser, getAllScores);

export default router;
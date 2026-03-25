import express from "express";
import {
  createDraw,
  executeDraw,
  getDraws
} from "../controllers/draw.controller.js";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticateToken, authorizeAdmin, createDraw);
router.post("/:drawId/execute", authenticateToken, authorizeAdmin, executeDraw);
router.get("/", authenticateToken, getDraws);

export default router;
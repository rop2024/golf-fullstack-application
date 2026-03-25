import express from "express";
import {
  createDraw,
  executeDraw,
  getDraws
} from "../controllers/draw.controller.js";
import { authenticateUser, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, authorizeAdmin, createDraw);
router.post("/:drawId/execute", authenticateUser, authorizeAdmin, executeDraw);
router.get("/", authenticateUser, getDraws);

export default router;
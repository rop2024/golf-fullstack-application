import express from "express";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin routes placeholder
router.get("/dashboard", authenticateToken, authorizeAdmin, (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

export default router;
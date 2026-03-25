import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cronService from "./services/cron.service.js";
import authRoutes from "./routes/auth.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import winnersRoutes from "./routes/winners.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/winners", winnersRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    cronJobs: cronService.getJobs()
  });
});

// Cron jobs endpoint (for monitoring)
app.get("/api/cron-jobs", (req, res) => {
  res.json({ jobs: cronService.getJobs() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Initialize cron jobs when server starts
if (process.env.NODE_ENV !== 'test') {
  cronService.initialize();
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Cron jobs: ${process.env.NODE_ENV !== 'test' ? 'enabled' : 'disabled (test mode)'}`);
});
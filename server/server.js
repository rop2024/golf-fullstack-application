import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import cronService from "./services/cron.service.js";
import authRoutes from "./routes/auth.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import winnersRoutes from "./routes/winners.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (for Render)
app.set('trust proxy', 1);

// Webhook route must come before express.json() to handle raw body
app.use("/api/webhook", webhookRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/winners", winnersRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Cron jobs endpoint (for monitoring)
app.get("/api/cron-jobs", (req, res) => {
  res.json({ jobs: cronService.getJobs() });
});

// Serve static files in production (if needed)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message
  });
});

// Initialize cron jobs (only in production, not in test)
if (process.env.NODE_ENV === 'production') {
  cronService.initialize();
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${corsOptions.origin}`);
});
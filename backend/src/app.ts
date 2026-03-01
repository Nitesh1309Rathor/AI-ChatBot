import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import healthRoutes from "./routes/health.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

// middlewares:
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.FRONTEND_URL || "https://ai-chat-bot-nine-black.vercel.app", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// app routes:
app.use("/api", routes);
app.use("/", healthRoutes);

// error handling:
app.use(errorMiddleware);

export default app;

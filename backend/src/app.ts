import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import healthRoutes from "./routes/health.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

// middlewares:
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// app routes:
app.use("/api", routes);
app.use("/", healthRoutes);

// error handling:
app.use(errorMiddleware);

export default app;

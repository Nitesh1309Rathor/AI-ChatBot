import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import healthRoutes from "./routes/health.route";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();

// middlewares:
app.use(cors());
app.use(express.json());

// app routes:
app.use("/api", routes);
app.use("/", healthRoutes);

// error handling:
app.use(errorMiddleware);

export default app;

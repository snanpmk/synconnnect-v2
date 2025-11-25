import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";
import corsMiddleware from "./config//cors.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(corsMiddleware);
app.use(helmet());
app.use(morgan("dev"));

app.use("/uploads", express.static("server/uploads"));

app.use("/api", routes);

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Sync Connect API is running" });
});

app.use(errorHandler);

export default app;

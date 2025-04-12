import dotenv from "dotenv";
import connectDB from "./config/database";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./logger";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  logger?.info(`Server running on http://localhost:${PORT}`);
});

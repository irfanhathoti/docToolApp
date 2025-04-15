import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./logger";
import authRoutes from "./routes/auth"; // Import the routes
import pdfConverter from "./routes/tools";
import path from "path";
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware for handling CORS, cookies, and JSON parsing
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this if your frontend is on a different domain
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mount the routes here
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes); // Mount the auth routes on the '/auth' path
app.use("/tools", pdfConverter);

// Example of a simple route to check if the server is working
app.get("/", (req, res) => {
  res.send("Hello, server is running!");
});

// Start the server
app.listen(PORT, () => {
  logger?.info(`Server running on http://localhost:${PORT}`);
});

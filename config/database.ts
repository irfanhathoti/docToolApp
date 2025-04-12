import mongoose from "mongoose";
import logger from "../logger";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "DocToolApp",
    });
    logger?.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger?.error(error);
    process.exit(1);
  }
};

export default connectDB;

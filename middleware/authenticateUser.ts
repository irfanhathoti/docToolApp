// middleware/authenticateUser.ts
import jwt from "jsonwebtoken";
import User from "../models/User";
import { NextFunction, Response, Request } from "express";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

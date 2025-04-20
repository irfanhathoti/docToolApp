// middleware/checkCredits.ts
import { NextFunction, Response } from "express";
import User from "../models/User";

export const checkCredits = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id; // Assuming you've decoded JWT into req.user
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user || user.credits === undefined) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits <= 0) {
      return res
        .status(403)
        .json({ message: "No credits left. Please purchase more." });
    }

    user.credits -= 1;
    await user.save();

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking credits", error });
  }
};

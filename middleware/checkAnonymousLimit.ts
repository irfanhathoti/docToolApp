import { Request, Response, NextFunction } from "express";

// Simplified IP map for demo (replace with Redis in prod)
const ipUploadMap = new Map<string, number>();

export const checkAnonymousLimit = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const ip = req.ip as string;
  const isLoggedIn = !!req.user; // Or however you track login status
  const uploadCountCookie = parseInt(req.cookies.uploadCount || "0", 10);
  const ipUploadCount = ipUploadMap.get(ip) || 0;

  if (!isLoggedIn) {
    if (uploadCountCookie >= 5) {
      res.status(401).json({
        message: "Upload limit reached. Please login to continue.",
        reason: "LOGIN_REQUIRED",
      });
      return; // 👈 return void
    }

    res.cookie("uploadCount", uploadCountCookie + 1, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  } else {
    if (ipUploadCount >= 10) {
      res.status(401).json({
        message: "Upload limit reached. Please make a payment to continue.",
        reason: "PAYMENT_REQUIRED",
      });
      return; // 👈 return void
    }

    ipUploadMap.set(ip, ipUploadCount + 1);
  }

  next(); // 👈 final call to next()
};

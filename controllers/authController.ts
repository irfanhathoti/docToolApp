// routes/auth.ts
import "../config/passport";
import { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import logger from "../logger";

class AuthController {
  // Google OAuth2 login
  public static googleAuth(req: Request, res: Response) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
  }

  // Google OAuth callback
  public static googleCallback(req: Request, res: Response) {
    passport.authenticate("google", { session: false }, async (err, user) => {
      if (err || !user) {
        return res.status(500).json({ message: "Google auth failed" });
      }

      try {
        if (user.disabled)
          return res.status(403).json({ message: "Account disabled" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });
        res.redirect("http://localhost:3000");
      } catch (error) {
        logger?.error("Google Auth Error: " + (error as Error).message);
        res.status(500).json({ message: "Internal server error" });
      }
    })(req, res);
  }

  // Signup (Email/Password)
  public static async signup(req: Request, res: Response): Promise<any> {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create<IUser>({
        name,
        email,
        password: hashedPassword,
        loginMethod: "EMAIL",
        role: "USER",
        credits: 5,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      // Instead of returning the response inside the function, directly send the response
      return res.status(201).json({ user: newUser });
    } catch (error) {
      logger?.error("Signup error: " + (error as Error).message);
      // Handle error by sending a response with status 500
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Login (Email/Password)
  public static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !user.password)
        return res
          .status(400)
          .json({ message: "User does not exist. Please sign up." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.status(200).json({ user });
    } catch (error) {
      logger?.error("Login error: " + (error as Error).message);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get current logged-in user
  public static async me(req: Request, res: Response): Promise<any> {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ user });
    } catch (error) {
      logger?.error("Auth check error: " + (error as Error).message);
      res.status(401).json({ message: "Invalid token" });
    }
  }

  // Logout
  public static logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  }
}

export default AuthController;

import express from "express";
import AuthController from "../controllers/authController";

const router = express.Router();

router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleCallback);
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/me", AuthController.me);
router.post("/logout", AuthController.logout);

export default router;

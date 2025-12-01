import express from "express";
import {
  googleAuthController,
  logoutController,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
const router = express.Router();

// Example: Register
router.post("/register", (req, res) => {
  res.json({ message: "User registered successfully!" });
});

// Example: Google login
router.post("/login", googleAuthController);

router.post("/logout", logoutController);

router.get("/refresh", refreshAccessToken);

router.post("/logout", (req, res) => {
  res.json({ message: "User logged out" });
});

export default router;

import express from "express";
import {
  googleAuthController,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
const router = express.Router();

// Example: Register
router.post("/register", (req, res) => {
  res.json({ message: "User registered successfully!" });
});

// Example: Google login
router.post("/login", googleAuthController);

router.get("/refresh", refreshAccessToken);

// Example: Logout
router.post("/logout", (req, res) => {
  res.json({ message: "User logged out" });
});

export default router;

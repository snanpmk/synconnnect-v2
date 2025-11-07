import express from "express";
const router = express.Router();

// Create order
router.post("/create-order", (req, res) => {
  res.json({ message: "Order created successfully" });
});

// Verify payment
router.post("/verify", (req, res) => {
  res.json({ message: "Payment verified successfully" });
});

export default router;

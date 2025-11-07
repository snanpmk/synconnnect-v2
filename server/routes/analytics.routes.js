import express from "express";
const router = express.Router();

// Get profile views or interactions
router.get("/views", (req, res) => {
  res.json({ message: "Fetched profile view analytics" });
});

// Get Google review stats
router.get("/reviews", (req, res) => {
  res.json({ message: "Fetched Google review stats" });
});

export default router;

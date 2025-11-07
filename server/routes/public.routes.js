import express from "express";
const router = express.Router();

// Public profile by username
router.get("/:username", (req, res) => {
  res.json({ message: `Public profile for ${req.params.username}` });
});

// Google review redirect
router.get("/:username/review", (req, res) => {
  res.json({
    message: `Redirecting to Google review for ${req.params.username}`,
  });
});

export default router;

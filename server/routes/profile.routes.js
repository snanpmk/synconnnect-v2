import express from "express";
const router = express.Router();

// Create profile
router.post("/", (req, res) => {
  res.json({ message: "Profile created" });
});

// Get profile by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Fetched profile ${req.params.id}` });
});

// Update profile
router.put("/:id", (req, res) => {
  res.json({ message: `Profile ${req.params.id} updated` });
});

// Delete profile
router.delete("/:id", (req, res) => {
  res.json({ message: `Profile ${req.params.id} deleted` });
});

export default router;

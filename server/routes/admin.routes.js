import express from "express";
import { addUserByAdmin } from "../controllers/admin.controller.js";
const router = express.Router();

router.post("/add-user", addUserByAdmin);


// Get all users
router.get("/users", (req, res) => {
  res.json({ message: "Fetched all users" });
});

// Delete a user
router.delete("/users/:id", (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
});

// System stats
router.get("/stats", (req, res) => {
  res.json({ message: "Admin system stats fetched" });
});

export default router;

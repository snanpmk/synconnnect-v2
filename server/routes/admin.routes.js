import express from "express";
import {
  addUserByAdmin,
  deleteUserByAdmin,
  editUserByAdmin,
  getUsers,
} from "../controllers/admin.controller.js";
const router = express.Router();

router.post("/user/add", addUserByAdmin);

router.get("/users", getUsers);

// Get all users
router.get("/users", (req, res) => {
  res.json({ message: "Fetched all users" });
});

// Delete a user
router.delete("/users/delete/", deleteUserByAdmin);

router.put("/users/edit/", editUserByAdmin);

// System stats
router.get("/stats", (req, res) => {
  res.json({ message: "Admin system stats fetched" });
});

export default router;

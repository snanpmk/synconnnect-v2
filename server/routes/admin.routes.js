import express from "express";
import {
  addUserByAdmin,
  deleteUserByAdmin,
  editUserByAdmin,
  getUsers,
} from "../controllers/admin.controller.js";
import { isAdminAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/user/add", isAdminAuth, addUserByAdmin);

router.get("/users", isAdminAuth, getUsers);

// Delete a user
router.delete("/users/delete/", isAdminAuth, deleteUserByAdmin);

router.put("/users/edit/", isAdminAuth, editUserByAdmin);
// Get all users
router.get("/users", (req, res) => {
  res.json({ message: "Fetched all users" });
});

// System stats
router.get("/stats", (req, res) => {
  res.json({ message: "Admin system stats fetched" });
});

export default router;

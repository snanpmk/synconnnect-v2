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

router.delete("/users/delete/", isAdminAuth, deleteUserByAdmin);

router.put("/users/edit/", isAdminAuth, editUserByAdmin);

export default router;

import express from "express";
import {
  getUserById,
  updateUserSetup,
} from "../controllers/user.controller.js";
import { getDashboardStats } from "../controllers/analytics.controller.js";
const router = express.Router();

router.get("/user/public", getUserById);
router.put("/setup", updateUserSetup);
router.get("/business/analytics", getDashboardStats);

export default router;

import express from "express";
import {
  getUserById,
  updateUserSetup,
} from "../controllers/user.controller.js";
import { getDashboardStats } from "../controllers/analytics.controller.js";
import { createLead } from "../controllers/lead.controller.js";
import { auth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/user/public", getUserById);
router.post("/user/public/lead", createLead);

router.put("/setup", auth, updateUserSetup);
router.get("/business/analytics", auth, getDashboardStats);

export default router;

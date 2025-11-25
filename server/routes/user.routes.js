import express from "express";
import {
  getUserById,
  updateUserSetup,
} from "../controllers/user.controller.js";
import { getDashboardStats } from "../controllers/analytics.controller.js";
import { createLead } from "../controllers/lead.controller.js";
const router = express.Router();

router.get("/user/public", getUserById);
router.post("/user/public/lead", createLead);

router.put("/setup", updateUserSetup);
router.get("/business/analytics", getDashboardStats);

export default router;

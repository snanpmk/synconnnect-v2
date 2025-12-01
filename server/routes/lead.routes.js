import express from "express";
import {
  createLead,
  getLeadsByUser,
  getLead,
} from "../controllers/lead.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user", auth, getLeadsByUser);

router.get("/", auth, getLead);

export default router;

import express from "express";
import {
  createLead,
  getLeadsByUser,
  getLead,
} from "../controllers/lead.controller.js";

const router = express.Router();

router.get("/user", getLeadsByUser);

router.get("/", getLead);

export default router;

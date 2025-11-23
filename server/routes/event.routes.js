// routes/eventRoutes.js
import express from "express";
import { createEvent } from "../controllers/event.controller.js";

const router = express.Router();

// POST /user/event
router.post("/", createEvent);

export default router;

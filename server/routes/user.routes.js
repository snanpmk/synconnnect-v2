import express from "express";
import { getUserById, updateUserSetup } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/user", getUserById);
router.put("/setup", updateUserSetup);

export default router;

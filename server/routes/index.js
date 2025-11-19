import express from "express";

import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import paymentRoutes from "./payment.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import adminRoutes from "./admin.routes.js";
import publicRoutes from "./public.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/payment", paymentRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admin", adminRoutes);
router.use("/public", publicRoutes);
router.use("/", userRoutes);

export default router;

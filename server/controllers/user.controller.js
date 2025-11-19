// controllers/userController.js

import User from "../models/User.js";
import mongoose from "mongoose";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.query;

    // 1️⃣ Validate presence of ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required in query parameters (e.g., /user?id=123)",
      });
    }

    // 2️⃣ Validate ObjectId format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // 3️⃣ Find user and exclude sensitive fields
    const user = await User.findById(id).select("-password -isSuperAdmin");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4️⃣ Send success response
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// controllers/userController.js

import User from "../models/User.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

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

export const updateUserSetup = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid or missing userId in query",
      });
    }

    const payload = req.body;

    console.log("Payload:", payload?.socials);

    // Auto-copy phone → whatsapp
    if (payload.useSameNumberForWhatsapp && payload.phone) {
      payload.whatsapp = {
        dialCode: payload.phone.dialCode,
        countryCode: payload.phone.countryCode,
        phoneNumber: payload.phone.phoneNumber,
      };
    }

    // ❌ Prevent accidental email overwrite
    if ("email" in payload) {
      delete payload.email;
    }

    // ✔ Whitelist allowed fields to prevent unwanted updates
    const allowedFields = [
      "fullName",
      "tagline",
      "detailedAbout",
      "phone",
      "whatsapp",
      "website",
      "address",
      "location",
      "socialLinks",
      "businessName",
      "businessCategory",
      "coverPhoto",
      "profilePhoto",
      "servicesHeading",
      "services",
      "youtubeVideoUrl",
      "googleReviewLink",
      "designation",
      "companyName",
    ];

    const safeUpdate = {};

    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        safeUpdate[key] = payload[key];
      }
    }

    // Always set setupStatus to 1
    safeUpdate.setupStatus = 1;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

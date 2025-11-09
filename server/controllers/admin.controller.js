import { sgMail } from "../config/email.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const addUserByAdmin = async (req, res) => {
  try {
    const { fullName, email, accountType } = req.body;

    if (!fullName || !email || !accountType) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // 2️⃣ Create a minimal user
    const newUser = await User.create({
      fullName,
      email,
      paymentStatus: "pending",
      accountType,
    });

    // 3️⃣ Send welcome email via SendGrid
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // your verified sender
      subject: "Welcome to SynConnect 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome, ${fullName}!</h2>
          <p>We're excited to have you on <strong>SynConnect</strong>.</p>
          <p>You can now complete your profile and get started.</p>
          <p style="margin-top: 20px;">Cheers,<br/>The SynConnect Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    logger.info(`📧 Welcome email sent to ${email}`);

    // 4️⃣ Respond
    res.status(201).json({
      message: "User created successfully and welcome email sent",
      user: newUser,
    });
  } catch (error) {
    logger.error(`Admin add user failed: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { accountType, paymentStatus, search } = req.query;

    const filter = {
      $or: [{ isSuperAdmin: { $exists: false } }, { isSuperAdmin: false }],
    };
    // 🧩 Optional filters
    if (accountType) filter.accountType = accountType;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .select("-password -isSuperAdmin");

    logger.info(`👥 Fetched ${users.length} users from DB`);

    res.status(200).json({
      message: "Users fetched successfully",
      total: users.length,
      users,
    });
  } catch (error) {
    logger.error(`Failed to fetch users: ${error.message}`);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    // 1️⃣ Get ID from query parameters
    const userId = req.query.id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required in the query parameters" });
    }

    // 2️⃣ Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    }

    logger.info(`🗑️ User ${userId} (${deletedUser.email}) deleted by admin.`);

    // 3️⃣ Respond
    res.status(200).json({
      message: `User ${userId} deleted successfully`,
      deletedUserId: userId,
    });
  } catch (error) {
    logger.error(`Admin delete user failed: ${error.message}`);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const editUserByAdmin = async (req, res) => {
  try {
    // 1️⃣ Get ID from query parameters and update fields from body
    const userId = req.query.id;
    const updateFields = req.body; // Expecting fields like { fullName: "New Name", accountType: "pro" }
    console.log(req.body,'reeeeeeeeeeeeeeeee');

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required in the query parameters" });
    }

    // Optional: Check if body is empty or contains sensitive/unallowed fields
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "Update fields are required in the request body" });
    }

    // 2️⃣ Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true } // 'new: true' returns the updated document
    ).select("-password -isSuperAdmin");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    }

    logger.info(`✏️ User ${userId} (${updatedUser.email}) updated by admin.`);

    // 3️⃣ Respond
    res.status(200).json({
      message: `User ${userId} updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    logger.error(`Admin edit user failed: ${error.message}`);
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

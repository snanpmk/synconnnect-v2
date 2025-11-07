import { sgMail } from "../config/email.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const addUserByAdmin = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
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
      accountType: "individual",
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

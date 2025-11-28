import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const googleAuthController = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    // 1️⃣ Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage",
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${err}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // 2️⃣ Fetch user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!userInfoResponse.ok) {
      const err = await userInfoResponse.text();
      throw new Error(`Fetching user info failed: ${err}`);
    }

    const googleUser = await userInfoResponse.json();
    const { name, email } = googleUser;

    if (!email) {
      return res.status(400).json({ message: "Google user email missing" });
    }

    // 3️⃣ Check if user exists or create one
    let user = await User.findOne({ email }).select("-password");

    let userStatus = "existing";

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        paymentStatus: "pending", // new users start pending
      });
      userStatus = "new";
    }

    // 4️⃣ Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    console.log(refreshToken);

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    // 5️⃣ Set refresh token in cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const responseUser = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      ...(user.isSuperAdmin && { isSuperAdmin: true }),
    };

    const response = {
      message: "Login successful",
      status: userStatus, // "new" or "existing"
      user: responseUser,
      accessToken,
    };

    // 👉 Send id only if existing user
    if (userStatus === "existing") {
      response.user.id = user._id;
    }

    // 7️⃣ Send response
    res.status(200).json(response);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token found" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Issue a new short-lived access token
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

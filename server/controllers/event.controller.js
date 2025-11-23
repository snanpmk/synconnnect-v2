// controllers/eventController.js
import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { userId, type, meta } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        success: false,
        message: "userId and type are required",
      });
    }

    const ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress || null;

    const userAgent = req.headers["user-agent"] || null;

    // Device detection (super simple)
    const device = /mobile/i.test(userAgent) ? "mobile" : "desktop";

    const event = await Event.create({
      userId,
      type,
      meta,
      ip,
      userAgent,
      device,
    });

    return res.status(201).json({
      success: true,
      message: "Event logged successfully",
      event,
    });
  } catch (error) {
    console.error("Event logging error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while logging event",
      error: error.message,
    });
  }
};

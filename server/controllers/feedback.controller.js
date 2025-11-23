// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const { userId, rating, feedback } = req.body;

    if (!userId || !rating || !feedback) {
      return res.status(400).json({
        success: false,
        message: "userId, rating, and feedback are required",
      });
    }

    const created = await Feedback.create({
      userId,
      rating,
      feedback,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: created,
    });
  } catch (error) {
    console.error("Feedback submit error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting feedback",
      error: error.message,
    });
  }
};

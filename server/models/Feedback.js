import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 Fast lookup by user
    },

    rating: {
      type: Number,
      required: true,
      index: true, // 🔥 Useful for analytics (count 1-star, 5-star, etc.)
    },

    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Index for sorting/filtering by date (analytics, recent feedback list)
FeedbackSchema.index({ createdAt: -1 });

// Optional compound index (useful if you render last 10 feedbacks of a user)
FeedbackSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Feedback", FeedbackSchema);

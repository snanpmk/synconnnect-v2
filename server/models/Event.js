// models/Event.js
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
    },

    meta: {
      type: Object,
      default: {},
    },

    ip: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    device: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Helpful indexes
EventSchema.index({ userId: 1, createdAt: -1 });
EventSchema.index({ type: 1 });
EventSchema.index({ createdAt: -1 });

export default mongoose.model("Event", EventSchema);

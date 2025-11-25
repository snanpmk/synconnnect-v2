import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Person who submitted the lead
    leadName: {
      type: String,
      required: true,
      trim: true,
    },

    placeWeMet: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      dialCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      fullNumber: { type: String }, // auto-generated
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional business context
    leadType: {
      type: String,
      enum: ["personal", "business", "partnership", "service-request"],
      default: "business",
    },

    status: {
      type: String,
      enum: ["new", "in-progress", "converted", "closed"],
      default: "new",
    },

    source: {
      type: String,
      default: "Profile Page Connect Button",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);

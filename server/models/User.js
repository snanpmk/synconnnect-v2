import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    accountType: {
      type: String,
      enum: ["individual", "business"],
      default: "individual",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      dialCode: String,
      countryCode: String,
      phoneNumber: String,
    },

    whatsapp: {
      dialCode: String,
      countryCode: String,
      phoneNumber: String,
    },

    profilePhoto: {
      fullPath: { type: String, default: "" },
      url: { type: String, default: "" },
    },

    coverPhoto: {
      fullPath: { type: String, default: "" },
      url: { type: String, default: "" },
    },

    designation: { type: String, default: null },
    companyName: { type: String, default: null },
    tagline: { type: String, default: null },
    detailedAbout: { type: String, default: null },

    cardStatus: {
      type: String,
      enum: ["Draft", "Designed", "Delivered"],
      default: "Draft",
    },

    setupStatus: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    // -----------------------------------------------
    // Business Details
    // -----------------------------------------------
    businessName: { type: String, trim: true },
    businessCategory: { type: String, trim: true },
    businessWebsite: { type: String, trim: true },
    googleReviewLink: { type: String, trim: true },
    paymentQrCode: { type: String, trim: true },
    location: { type: String, trim: true },
    youtubeVideoUrl: { type: String, trim: true },

    // -----------------------------------------------
    // Services Section
    // -----------------------------------------------
    servicesHeading: {
      type: String,
      trim: true,
      default: "",
    },

    services: [
      {
        title: { type: String, trim: true, required: true },
        description: { type: String, trim: true, default: "" },
      },
    ],

    // -----------------------------------------------
    // Common
    // -----------------------------------------------
    paymentStatus: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },

    createdAt: { type: Date, default: Date.now },

    isSuperAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    socialLinks: [socialLinkSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

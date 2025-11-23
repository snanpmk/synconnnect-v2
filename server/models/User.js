import mongoose from "mongoose";

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

    profilePicUrl: {
      type: String,
      default: "",
    },

    coverPhoto: {
      fullPath: { type: String, default: "" },
      url: { type: String, default: "" },
    },

    jobTitle: { type: String, default: null },
    companyname: { type: String, default: null },
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

    // ----------------------------------------------------
    // ⭐ Business details
    businessName: { type: String, trim: true },
    businessCategory: { type: String, trim: true },
    businessWebsite: { type: String, trim: true },
    googleReviewLink: { type: String, trim: true },
    paymentQrCode: { type: String, trim: true },
    location: { type: String, trim: true },
    youtubeVideoUrl: { type: String, trim: true },

    // ----------------------------------------------------

    // ⭐ New Fields: Services Section
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

    // ----------------------------------------------------
    // Common
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

    socialLinks: {
      call: { type: String, trim: true },
      email: { type: String, trim: true },
      whatsapp: { type: String, trim: true },
      telegram: { type: String, trim: true },
      location: { type: String, trim: true },

      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
      x: { type: String, trim: true },
      facebook: { type: String, trim: true },
      youtube: { type: String, trim: true },
      threads: { type: String, trim: true },
      snapchat: { type: String, trim: true },
      tiktok: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      medium: { type: String, trim: true },
      behance: { type: String, trim: true },
      dribbble: { type: String, trim: true },

      googleMaps: { type: String, trim: true },
      googleReview: { type: String, trim: true },
      bookingLink: { type: String, trim: true },
      onlineStore: { type: String, trim: true },
      tripAdvisor: { type: String, trim: true },
      zomato: { type: String, trim: true },
      swiggy: { type: String, trim: true },
      justDial: { type: String, trim: true },

      website: { type: String, trim: true },
      calendar: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

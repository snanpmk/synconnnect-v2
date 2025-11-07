import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    profilePicUrl: {
      type: String,
      default: "",
    },
    brandImageUrl: {
      type: String,
      default: null,
    },
    jobTitle: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: false,
    },
    cardStatus: {
      type: String,
      enum: ["Draft", "Designed", "Delivered"],
      default: "Draft",
    },

    // ✅ Distinguish between user types
    accountType: {
      type: String,
      enum: ["individual", "business"],
      default: "individual",
    },

    // ✅ For business accounts only
    businessName: {
      type: String,
      trim: true,
    },
    businessCategory: {
      type: String,
      trim: true,
    },
    businessWebsite: {
      type: String,
      trim: true,
    },
    googleReviewLink: {
      type: String,
      trim: true,
    },
    paymentQrCode: {
      type: String,
      trim: true,
    },

    // ✅ Common fields
    paymentStatus: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    socialLinks: {
      // 📞 Direct Contact Methods
      call: { type: String, trim: true }, // phone number or tel: link
      email: { type: String, trim: true },
      whatsapp: { type: String, trim: true },
      telegram: { type: String, trim: true },
      location: { type: String, trim: true }, // address or Google Maps link

      // 👤 Personal / Professional
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
      x: { type: String, trim: true }, // formerly Twitter
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

      // 🏢 Business-Specific
      googleMaps: { type: String, trim: true },
      googleReview: { type: String, trim: true },
      bookingLink: { type: String, trim: true },
      onlineStore: { type: String, trim: true },
      tripAdvisor: { type: String, trim: true },
      zomato: { type: String, trim: true },
      swiggy: { type: String, trim: true },
      justDial: { type: String, trim: true },

      // 🌐 General / Others
      website: { type: String, trim: true },
      calendar: { type: String, trim: true }, // meeting scheduler (Calendly, etc.)
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

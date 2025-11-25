import Event from "../models/Event.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import Leads from "../models/Lead.js";
import { getDateRange } from "../utils/getDateRange.js";
import moment from "moment";

/* -----------------------------------------------------------
 * Helper: Validate User and Fetch User Doc
 * WHY: Keeps main handler clean & avoids repeating user checks
 * ----------------------------------------------------------- */
const getUserOrError = async (userId, res) => {
  if (!userId)
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  return user;
};

/* -----------------------------------------------------------
 * Helper: Prepare Contact & Social Buckets
 * WHY: Makes it easy to manage dynamic keys
 * ----------------------------------------------------------- */
const prepareDynamicContactSocialKeys = (user) => {
  const contactKeys = [
    "call",
    "email",
    "whatsapp",
    "sms",
    "telegram",
    "location",
  ];

  const socialKeys = Object.keys(user.socialLinks || {}).filter(
    (k) => !contactKeys.includes(k)
  );

  const contact = { total: 0 };
  contactKeys.forEach((k) => (contact[k] = 0));

  const social = { total: 0 };
  socialKeys.forEach((k) => (social[k] = 0));

  return { contactKeys, socialKeys, contact, social };
};

/* -----------------------------------------------------------
 * Helper: Create Trend Buckets
 * WHY: Trend generation is complex → separate improves readability
 * ----------------------------------------------------------- */
const generateTrendBuckets = (range, start, end) => {
  const labels = [];
  const buckets = [];

  const push = (s, e, label) => {
    labels.push(label);
    buckets.push({ start: s.clone(), end: e.clone() });
  };

  let current = moment(start).startOf("day");
  const last = moment(end).endOf("day");

  if (range === "last_week") {
    const days = last.diff(current, "days") + 1;
    for (let i = 0; i < days; i++) {
      const s = current.clone().add(i, "days").startOf("day");
      const e = s.clone().endOf("day");
      push(s, e, s.format("ddd"));
    }
    return { labels, buckets };
  }

  if (range === "last_month") {
    const totalDays = last.diff(current, "days") + 1;
    const base = Math.floor(totalDays / 4);
    let remainder = totalDays % 4;

    let cursor = current.clone();
    for (let i = 0; i < 4; i++) {
      const size = base + (remainder-- > 0 ? 1 : 0);
      const s = cursor.clone();
      let e = s
        .clone()
        .add(size - 1, "days")
        .endOf("day");

      if (e.isAfter(last)) e = last.clone();
      push(s, e, `Week ${i + 1}`);

      cursor = e.clone().add(1, "day");
      if (cursor.isAfter(last)) break;
    }
    return { labels, buckets };
  }

  if (range === "last_6_months" || range === "last_year") {
    const blocks = range === "last_year" ? 12 : 6;
    let cursor = current.clone();

    for (let i = 0; i < blocks; i++) {
      const s = cursor.clone();
      let e =
        i === blocks - 1
          ? last.clone()
          : s.clone().endOf("month").isAfter(last)
          ? last.clone()
          : s.clone().endOf("month");

      push(s, e, s.format("MMM"));
      cursor = e.clone().add(1, "day");
      if (cursor.isAfter(last)) break;
    }
    return { labels, buckets };
  }

  // Custom range
  push(
    current.clone(),
    last.clone(),
    `${current.format("DD MMM")} - ${last.format("DD MMM")}`
  );

  return { labels, buckets };
};

/* -----------------------------------------------------------
 * Helper: Process Events into statistics + trend counts
 * WHY: Huge block → splitting reduces mental load
 * ----------------------------------------------------------- */
const processEvents = (events, buckets, contact, social) => {
  let views = 0;
  const viewsTrend = Array(buckets.length).fill(0);
  const contactTrend = Array(buckets.length).fill(0);
  const socialTrend = Array(buckets.length).fill(0);

  const positiveRatings = [];

  events.forEach((ev) => {
    const type = ev.type;
    const time = moment(ev.createdAt);

    // Count totals
    if (type === "view") views++;

    if (type.startsWith("contact_") || type === "contact_click") {
      const key = type.startsWith("contact_")
        ? type.replace("contact_", "")
        : "click";
      contact.total++;
      contact[key] = (contact[key] || 0) + 1;
    }

    if (type.startsWith("social_")) {
      const key = type.replace("social_", "");
      social.total++;
      social[key] = (social[key] || 0) + 1;
    }

    // public feedback click with rating ≥3
    if (type === "feedback_clicked_public") {
      const rating = Number(ev.meta?.rating);
      if (!isNaN(rating) && rating >= 3) positiveRatings.push(rating);
    }

    // Trend mapping
    buckets.forEach((b, idx) => {
      if (time.isBetween(b.start, b.end, undefined, "[]")) {
        if (type === "view") viewsTrend[idx]++;
        if (type.startsWith("contact_") || type === "contact_click")
          contactTrend[idx]++;
        if (type.startsWith("social_")) socialTrend[idx]++;
      }
    });
  });

  return {
    views,
    viewsTrend,
    contactTrend,
    socialTrend,
    positiveRatings,
  };
};

/* -----------------------------------------------------------
 * Helper: Process Leads into Trend
 * WHY: Keeps trend logic separate from main handler
 * ----------------------------------------------------------- */
const processLeadsTrend = (leads, buckets) => {
  const trend = Array(buckets.length).fill(0);

  leads.forEach((lead) => {
    const time = moment(lead.createdAt);
    buckets.forEach((b, idx) => {
      if (time.isBetween(b.start, b.end, undefined, "[]")) {
        trend[idx]++;
      }
    });
  });

  return trend;
};

/* -----------------------------------------------------------
 * Helper: Prepare Ratings Summary
 * WHY: Better separates UI-level rating aggregation logic
 * ----------------------------------------------------------- */
const prepareRatingsSummary = (positiveRatings, feedbackDocs) => {
  const negativeRatings = feedbackDocs.map((f) => f.rating);
  const allRatings = [...positiveRatings, ...negativeRatings];

  const starCounts = {
    5: allRatings.filter((r) => r === 5).length,
    4: allRatings.filter((r) => r === 4).length,
    3: allRatings.filter((r) => r === 3).length,
    2: allRatings.filter((r) => r === 2).length,
    1: allRatings.filter((r) => r === 1).length,
  };

  const totalReviews = allRatings.length;
  const average =
    totalReviews > 0
      ? (allRatings.reduce((a, b) => a + b, 0) / totalReviews).toFixed(1)
      : "0.0";

  return {
    average,
    totalReviews,
    positiveReviews: positiveRatings.length,
    negativeReviews: negativeRatings.length,
    stars: starCounts,
  };
};

/* -----------------------------------------------------------
 * MAIN CONTROLLER: getDashboardStats
 * WHY: Now extremely clean and readable
 * ----------------------------------------------------------- */
export const getDashboardStats = async (req, res) => {
  try {
    const { userId, range = "last_month", from, to } = req.query;

    const user = await getUserOrError(userId, res);
    if (!user) return;

    // Date range
    const { start, end } = getDateRange(range, from, to);
    const mStart = moment(start);
    const mEnd = moment(end);

    // Dynamic social/contact
    const { contact, social } = prepareDynamicContactSocialKeys(user);

    // Fetch events/leads
    const [events, feedbackDocs, leads] = await Promise.all([
      Event.find({ userId, createdAt: { $gte: start, $lte: end } }),
      Feedback.find({
        userId,
        createdAt: { $gte: start, $lte: end },
        rating: { $lte: 2 },
      }),
      Leads.find({ userId, createdAt: { $gte: start, $lte: end } }).sort({
        createdAt: -1,
      }),
    ]);

    // Trend buckets
    const { labels, buckets } = generateTrendBuckets(range, mStart, mEnd);

    // Process events
    const { views, viewsTrend, contactTrend, socialTrend, positiveRatings } =
      processEvents(events, buckets, contact, social);

    // Leads trend
    const leadsTrend = processLeadsTrend(leads, buckets);

    // Rating summary
    const ratingSummary = prepareRatingsSummary(positiveRatings, feedbackDocs);

    // Final response
    return res.json({
      success: true,
      range: { start, end },
      data: {
        views,
        contact,
        social,

        trend: {
          labels,
          views: viewsTrend,
          contact: contactTrend,
          social: socialTrend,
          leads: leadsTrend,
        },

        ratings: ratingSummary,

        negativeFeedbackList: feedbackDocs.map((f) => ({
          rating: f.rating,
          feedback: f.feedback,
          createdAt: f.createdAt,
          status: "pending",
        })),

        leads: {
          total: leads.length,
          list: leads,
        },
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving analytics",
      error: err.message,
    });
  }
};

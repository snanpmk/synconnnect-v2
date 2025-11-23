import Event from "../models/Event.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import { getDateRange } from "../utils/getDateRange.js";
import moment from "moment";

export const getDashboardStats = async (req, res) => {
  try {
    const { userId, range = "last_month", from, to } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    // 1. Fetch user
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // 2. Date range
    const { start, end } = getDateRange(range, from, to);
    // Normalize to day boundaries but keep originals for return
    const mStartOrig = moment(start);
    const mEndOrig = moment(end);

    // 3. Fetch data
    const [events, feedbackDocs] = await Promise.all([
      Event.find({ userId, createdAt: { $gte: start, $lte: end } }),
      Feedback.find({
        userId,
        createdAt: { $gte: start, $lte: end },
        rating: { $lte: 2 },
      }),
    ]);

    // 4. Dynamic keys
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

    let views = 0;
    let positiveRatingsArray = [];
    let negativeRatingsArray = [];

    const negativeFeedbackList = feedbackDocs.map((f) => ({
      rating: f.rating,
      feedback: f.feedback,
      createdAt: f.createdAt,
      status: "pending",
    }));

    // ---------------------------
    // Robust trend bucket generator
    // ---------------------------
    const generateTrendBuckets = (range, start, end) => {
      const labels = [];
      const buckets = [];

      // Clone and normalize boundaries to avoid mutation
      let current = moment(start).startOf("day");
      const last = moment(end).endOf("day");

      // Helper: push bucket and advance current
      const pushBucket = (sMoment, eMoment, label) => {
        labels.push(label);
        buckets.push({ start: sMoment.clone(), end: eMoment.clone() });
      };

      // LAST WEEK -> day-by-day for the actual window length (usually 7 days)
      if (range === "last_week") {
        const days = last.diff(current, "days") + 1;
        for (let i = 0; i < days; i++) {
          const s = current.clone().add(i, "days").startOf("day");
          const e = s.clone().endOf("day");
          pushBucket(s, e, s.format("ddd"));
        }
        return { labels, buckets };
      }

      // LAST MONTH -> split the window into 4 contiguous buckets (balanced)
      if (range === "last_month") {
        const totalDays = last.diff(current, "days") + 1;
        // base bucket size (use Math.floor) and distribute remainder to first buckets
        const base = Math.floor(totalDays / 4);
        let remainder = totalDays % 4;

        let cursor = current.clone();
        for (let i = 0; i < 4; i++) {
          const size = base + (remainder > 0 ? 1 : 0);
          remainder = Math.max(0, remainder - 1);

          const s = cursor.clone();
          let e = s
            .clone()
            .add(size - 1, "days")
            .endOf("day");
          if (e.isAfter(last)) e = last.clone();

          pushBucket(s, e, `Week ${i + 1}`);

          // advance cursor
          cursor = e.clone().add(1, "day");
          if (cursor.isAfter(last)) break;
        }
        return { labels, buckets };
      }

      // LAST 6 MONTHS -> 6 contiguous buckets, each covering one calendar-month chunk from start
      if (range === "last_6_months") {
        let cursor = current.clone();
        for (let i = 0; i < 6; i++) {
          const s = cursor.clone();
          // prefer to end at end-of-month for middle buckets, last bucket ends at 'last'
          let e;
          if (i === 5) {
            e = last.clone();
          } else {
            e = s.clone().endOf("month");
            if (e.isAfter(last)) e = last.clone();
          }

          // Label: use "MMM" and show year if range crosses years
          const label = s.format("MMM");
          pushBucket(s, e, label);

          cursor = e.clone().add(1, "day");
          if (cursor.isAfter(last)) break;
        }
        return { labels, buckets };
      }

      // LAST YEAR -> create 12 contiguous month buckets (more granular and consistent)
      if (range === "last_year") {
        let cursor = current.clone();
        for (let i = 0; i < 12; i++) {
          const s = cursor.clone();
          let e;
          if (i === 11) {
            e = last.clone();
          } else {
            e = s.clone().endOf("month");
            if (e.isAfter(last)) e = last.clone();
          }

          // Label includes month and year if it spans multiple years
          const label = s.format("MMM");
          pushBucket(s, e, label);

          cursor = e.clone().add(1, "day");
          if (cursor.isAfter(last)) break;
        }
        return { labels, buckets };
      }

      // Default fallback: single bucket covering entire range
      pushBucket(
        current.clone(),
        last.clone(),
        `${current.format("DD MMM")} - ${last.format("DD MMM")}`
      );
      return { labels, buckets };
    };

    const { labels, buckets } = generateTrendBuckets(
      range,
      mStartOrig,
      mEndOrig
    );

    // initialize trends arrays
    const viewsTrend = Array(labels.length).fill(0);
    const contactTrend = Array(labels.length).fill(0);
    const socialTrend = Array(labels.length).fill(0);

    // ---------------------------
    // process events
    // ---------------------------
    events.forEach((ev) => {
      const t = ev.type;
      if (t === "view") views++;

      // contact events (capture contact_click + contact_*)
      if (t.startsWith("contact_") || t === "contact_click") {
        const key = t.startsWith("contact_")
          ? t.replace("contact_", "")
          : "click";
        contact.total++;
        if (contact[key] !== undefined) contact[key]++;
        else contact.other = (contact.other || 0) + 1;
      }

      // social events
      if (t.startsWith("social_")) {
        const key = t.replace("social_", "");
        social.total++;
        if (social[key] !== undefined) social[key]++;
        else social.other = (social.other || 0) + 1;
      }

      // public rating clicks
      if (t === "feedback_clicked_public") {
        const r = Number(ev.meta?.rating);
        if (!isNaN(r) && r >= 3) positiveRatingsArray.push(r);
      }

      // assign to trend bucket (use inclusive bounds)
      const time = moment(ev.createdAt);
      buckets.forEach((b, idx) => {
        if (time.isBetween(b.start, b.end, undefined, "[]")) {
          if (t === "view") viewsTrend[idx]++;
          else if (t.startsWith("contact_") || t === "contact_click")
            contactTrend[idx]++;
          else if (t.startsWith("social_")) socialTrend[idx]++;
        }
      });
    });

    // ---------------------------
    // ratings summary
    // ---------------------------
    negativeRatingsArray = feedbackDocs.map((f) => f.rating);
    const allRatings = [...positiveRatingsArray, ...negativeRatingsArray];

    const starCounts = {
      5: allRatings.filter((r) => r === 5).length,
      4: allRatings.filter((r) => r === 4).length,
      3: allRatings.filter((r) => r === 3).length,
      2: allRatings.filter((r) => r === 2).length,
      1: allRatings.filter((r) => r === 1).length,
    };

    const totalReviews = allRatings.length;
    const averageRating =
      totalReviews > 0
        ? (allRatings.reduce((a, b) => a + b, 0) / totalReviews).toFixed(1)
        : "0.0";

    // ---------------------------
    // final response
    // ---------------------------
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
        },
        ratings: {
          average: averageRating,
          totalReviews,
          positiveReviews: positiveRatingsArray.length,
          negativeReviews: negativeRatingsArray.length,
          stars: starCounts,
        },
        negativeFeedbackList,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving analytics",
        error: err.message,
      });
  }
};

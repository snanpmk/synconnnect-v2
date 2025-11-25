import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  try {
    const { userId, leadName, placeWeMet, contactNumber, note, leadType } =
      req.body;

    if (!userId || !leadName || !placeWeMet || !contactNumber?.phoneNumber)
      return res.status(400).json({ message: "Missing required fields" });

    const lead = await Lead.create({
      userId,
      leadName,
      placeWeMet,
      contactNumber,
      note: note || "",
      leadType: leadType || "business",
    });

    return res.status(201).json({
      success: true,
      message: "Lead added successfully",
      lead,
    });
  } catch (err) {
    console.error("Lead Create Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getLeadsByUser = async (req, res) => {
  try {
    const userId = req.query.id;

    const leads = await Lead.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leads,
    });
  } catch (err) {
    console.error("Get Leads Error:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

// Get single lead
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.query.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    return res.status(200).json({
      success: true,
      lead,
    });
  } catch (err) {
    console.error("Get Lead Error:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

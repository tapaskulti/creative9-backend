const mongoose = require("mongoose");

const siteVisitSchema = new mongoose.Schema(
  {
    visitor_id: {
      type: String,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    ip_address: {
      type: String,
      index: true, // ❌ NOT unique
    },
    user_agent: String,
    visit_date: {
      type: String, // YYYY-MM-DD
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ composite unique index (CORRECT)
siteVisitSchema.index(
  { visitor_id: 1, user_id: 1, ip_address: 1, visit_date: 1 },
  { unique: true }
);

module.exports = mongoose.model("SiteVisit", siteVisitSchema);
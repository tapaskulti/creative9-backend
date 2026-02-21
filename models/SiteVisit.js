const mongoose = require("mongoose");

const siteVisitSchema = new mongoose.Schema(
  {
    ip_address: String,
    user_agent: String,
    visit_date: String,
  },
  {
    timestamps: true,
    autoIndex: false // 🔥 IMPORTANT
  }
);

module.exports = mongoose.model("SiteVisit", siteVisitSchema);
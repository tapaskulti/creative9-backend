const mongoose = require("mongoose");

const siteVisitSchema = new mongoose.Schema(
  {
    ip_address: {
      type: String,
      unique: true,
      required: true,
    },
    user_agent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteVisit", siteVisitSchema);

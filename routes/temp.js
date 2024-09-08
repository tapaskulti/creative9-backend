const { getAllReviewByArtId, creatArtReview } = require("../controllers/reviewController");

 const router = require("express").Router();
  
  router.route("/creatArtReview").post(creatArtReview);
  router.route("/getAllReviewByArtId").get(getAllReviewByArtId);

  
  module.exports = router;
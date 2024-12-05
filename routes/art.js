const {
  createArt,
  getAllArt,
  getArtById,
  deleteArt,
  createArtReview,
  getArtReviewsByArtId,
  contactUs,
} = require("../controllers/artController");

const router = require("express").Router();

router.route("/createArt").post(createArt);
router.route("/getAllArt").get(getAllArt);
router.route("/getArt").get(getArtById);
router.route("/deleteArt").delete(deleteArt);
router.route("/createArtReviews").post(createArtReview);
router.route("/getArtReviewsByArtId").get(getArtReviewsByArtId);
router.route("/contactUsMail").post(contactUs);

module.exports = router;

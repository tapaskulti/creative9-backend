const {
  createArt,
  getAllArt,
  getArtById,
  deleteArt,
  createArtReview,
  getArtReviewsByArtId,
} = require("../controllers/artController");

const router = require("express").Router();

router.route("/createArt").post(createArt);
router.route("/getAllArt").get(getAllArt);
router.route("/getArt").get(getArtById);
router.route("/deleteArt").delete(deleteArt);
router.route("/createArtReviews").post(createArtReview);
router.route("/getArtReviewsByArtId").get(getArtReviewsByArtId);

module.exports = router;

const {
  createArt,
  getAllArt,
  getArtById,
} = require("../controllers/artController");

const router = require("express").Router();

router.route("/createArt").post(createArt);
router.route("/getAllArt").get(getAllArt);
router.route("/getArt").get(getArtById);

module.exports = router;

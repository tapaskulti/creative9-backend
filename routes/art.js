const {
  createArt,
  getAllArt,
  getArtById,
  deleteArt
} = require("../controllers/artController");

const router = require("express").Router();

router.route("/createArt").post(createArt);
router.route("/getAllArt").get(getAllArt);
router.route("/getArt").get(getArtById);
router.route("/deleteArt").delete(deleteArt)

module.exports = router;

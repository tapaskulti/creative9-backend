const {
  createService,
  getAllServices,
} = require("../controllers/serviceController");

const router = require("express").Router();

router.route("/").post(createService);
router.route("/").get(getAllServices);

module.exports = router;

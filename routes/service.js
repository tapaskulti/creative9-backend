const {
  createService,
  getAllServices,
  getAllServicesForOffer,
} = require("../controllers/serviceController");

const router = require("express").Router();

router.route("/").post(createService);
router.route("/").get(getAllServices);
router.route("/servicesListForOffer").get(getAllServicesForOffer);
router.route("/deleteService").delete()

module.exports = router;

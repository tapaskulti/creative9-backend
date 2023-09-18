const {
  createOrder,
  deliverPaintingOrder,
  updateIllustrationStatus,
  showAllOrderdPaintings,
  showAllOrderdIllustration,
  showUserPaintingOrderList,
  showUserIllustrationOrderList,
} = require("../controllers/orderController");

const router = require("express").Router();

router.route("/createOrder").post(createOrder);
router.route("/deliverPainting").patch(deliverPaintingOrder);
router.route("/updateIllustrationStatus").patch(updateIllustrationStatus);
router.route("/showAllOrderPaintings").get(showAllOrderdPaintings);
router.route("/showAllOrderIllustrations").get(showAllOrderdIllustration);
router.route("/userOrderPainting").get(showUserPaintingOrderList);
router.route("/userOrderIllustration").get(showUserIllustrationOrderList);

module.exports = router;

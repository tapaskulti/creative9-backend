const {
  createOrder,
  deliverPaintingOrder,
  updateIllustrationStatus,
  showAllOrderdPaintings,
  showAllOrderdIllustration,
  showUserPaintingOrderList,
  showUserIllustrationOrderList,
  paidArtOrder,
  paidIllustrationOrder,
} = require("../controllers/orderController");

const router = require("express").Router();

router.route("/createOrder").post(createOrder);
router.route("/deliverPainting").patch(deliverPaintingOrder);
router.route("/paidArtOrder").patch(paidArtOrder)
router.route("/paidIllustrationOrder").patch(paidIllustrationOrder)
router.route("/updateIllustrationStatus").patch(updateIllustrationStatus);
router.route("/showAllOrderPaintings").get(showAllOrderdPaintings);
router.route("/showAllOrderIllustrations").get(showAllOrderdIllustration);
router.route("/userOrderPainting").get(showUserPaintingOrderList);
router.route("/userOrderIllustration").get(showUserIllustrationOrderList);

module.exports = router;

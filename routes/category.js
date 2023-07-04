const {
  createCategory,
  getAllCategory,
  getCategoryById,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.route("/").post(createCategory);
router.route("/").get(getAllCategory);
router.route("/getSingleCategory").get(getCategoryById);

module.exports = router;

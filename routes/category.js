const {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.route("/").post(createCategory);
router.route("/").get(getAllCategory);
router.route("/getSingleCategory").get(getCategoryById);
router.route("/updateCategory").patch(updateCategory);
router.route("/deleteCategory").delete(deleteCategory);

module.exports = router;

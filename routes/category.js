const {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addPortfolioToCategory,
  getPortfolioByCategory,
  deletePortfolio,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.route("/").post(createCategory);
router.route("/").get(getAllCategory);
router.route("/getSingleCategory").get(getCategoryById);
router.route("/updateCategory").patch(updateCategory);
router.route("/deleteCategory").delete(deleteCategory);

// portfolio
router.route("/createPortfolio").post(addPortfolioToCategory)
router.route("/getPortfolioByCategory").get(getPortfolioByCategory)
router.route("/deletePortfolio").delete(deletePortfolio)

module.exports = router;

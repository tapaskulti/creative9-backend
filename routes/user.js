const {
  signup,
  activateEmail,
  login,
  getAccessToken,
  logout,
  forgotPasswordmail,
  checkToken,
  resetPassword,
  getUserDetails,
  getAllUsers,
  trackSiteVisit
} = require("../controllers/userController");

const router = require("express").Router();

router.route("/signup").post(signup);
router.route("/activation").post(activateEmail);
router.route("/login").post(login);
router.route("/accessToken").get(getAccessToken);
router.route("/userDetails").get(getUserDetails);
router.route("/userList").get(getAllUsers);
router.route("/logout").get(logout);

router.route("/forgotPassword").post(forgotPasswordmail);
router.route("/checkToken").get(checkToken);
router.post("/track-visit", trackSiteVisit);

router.post("/forgot-password", forgotPasswordmail);
router.get("/check-token", checkToken);
router.post("/reset-password", resetPassword);

module.exports = router;

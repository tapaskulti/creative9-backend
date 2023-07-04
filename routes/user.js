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
} = require("../controllers/userController");

const router = require("express").Router();

router.route("/signup").post(signup);
router.route("/activation").post(activateEmail);
router.route("/login").post(login);
router.route("/accessToken").get(getAccessToken);
router.route("/userDetails").get(getUserDetails);
router.route("/logout").get(logout);

router.route("/forgotPassword").post(forgotPasswordmail);
router.route("/checkToken").get(checkToken);
router.route("/restPassword").post(resetPassword);

module.exports = router;

const router = require("express").Router();
const { createChat, getChats, updateChat } = require("../controllers/chatController");

router.route("/getChats/:sender/:receiver").get(getChats);
router.route("/updateChat").patch(updateChat)

module.exports = router;

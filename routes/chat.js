const router = require("express").Router();
const { createChat, getChats } = require("../controllers/chatController");

router.route("/getChats/:sender/:receiver").get(getChats);

module.exports = router;

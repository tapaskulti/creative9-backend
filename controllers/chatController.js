const Chat = require("../models/chat");
const { ObjectId } = require("mongodb");

exports.getChats = async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    console.log(req.params, "params");
    const chats = await Chat.find({
      $or: [
        { sender: new ObjectId(sender), receiver: new ObjectId(receiver) },
        { sender: new ObjectId(receiver), receiver: new ObjectId(sender) },
      ],
    });

    console.log(chats, "chats");
    res.status(200).json({
      message: "Chats fetched successfully",
      chats,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateChat = async (req, res) => {
  try {
    const response = await Chat.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true }
    )

    console.log(response, "response chat .../");
    res.status(200).json({
      message: "Chats update successfully",
      response,
    });
  } catch (error) {
    console.log(error);
  }
}
const Chat = require("../models/chat");
const ObjectID = require("mongodb").ObjectId;

exports.createChat = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const chat = new Chat({
      sender,
      receiver,
      message,
    });
    await chat.save();
    res.io.emit("RECEIVE_MESSAGE", chat);

    res.status(200).json({
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {}
};

exports.getChats = async (req, res) => {
  try {
    console.log(req.params, "params");
    const chats = await Chat.find({
      $or: [
        {
          sender: new ObjectID(req.params.sender),
          receiver: new ObjectID(req.params.receiver),
        },
        // {
        //   sender: req.params.receiver.toString(),
        //   receiver: req.params.sender.toString(),
        // },
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

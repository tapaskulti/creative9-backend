const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const connectWithDb = require("./db/db");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const Chat = require("./models/chat");

const http = require("http");
const { Server } = require("socket.io");

connectWithDb();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(cookieParser(process.env.REFRESH_TOKEN_SECRET));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://creativevalley9.com",
    credentials: true,
    methods: ["GET", "POST"],
  },

  allowUpgrades: true,
});

app.use((req, res, next) => {
  res.io = io;
  next();
});

io.on("connection", async (socket) => {
  console.log("User connected");

  socket.on("user-connected", (userId) => {
    //   Store the MongoDB user ID in the socketId field
    console.log(userId, "id--->");
    User.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true })
      .then((user) => {
        console.log("User connected:", user.username);
      })
      .catch((error) => {
        console.error("Error updating socket ID:", error);
      });
  });

  socket.on("send-message", async (messages) => {
    console.log(messages, "mm");
    try {
      const { sender, receiver, message, offer } = messages.msg;
      const payload = {};
      let processedImages = [];
      if (messages?.msg?.images?.length > 0) {
        for (const image of messages?.msg?.images) {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "chat",
            crop: "scale",
          });
          processedImages.push({
            public_id: result?.public_id,
            secure_url: result?.secure_url,
          });
        }
      }
      processedImages.map((image) => {
        console.log(image, "uploaded image");
      });

      const chat = new Chat({
        sender,
        receiver,
        message,
        offer,
        images: processedImages,
      });

      await chat.save();

      let messagePaylod = {
        sender,
        receiver,
        message,
        offer,
        images: processedImages,
      };

      //   emit message to sender
      io.to(socket?.id).emit("receive-message", messagePaylod);

      // Emit the message to the receiver
      const receiverUser = await User.findById(receiver);
      if (receiverUser?.socketId) {
        io.to(receiverUser.socketId).emit("receive-message", messagePaylod);
      }
    } catch (error) {
      console.log(error?.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    User.findOneAndUpdate({ socketId: socket.id }, { socketId: null })
      .then((user) => {
        console.log("User disconnected");
      })
      .catch((error) => {
        console.error("Error updating socket ID:", error);
      });
  });
});

const allowedDomains = [
  "http://localhost:5173",
  "https://sea-turtle-app-jr3nk.ondigitalocean.app",
  "http://www.creativevalley9.com",
  "https://creativevalley9.com",
];

app.use(
  cors({
    // origin: "http://24.199.70.115",
    // origin: "https://drivado-frontend.web.app",
    // origin: "*",

    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedDomains.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

const apiVersion = process.env.apiVersion || "/api/v1";

// routers
app.use(apiVersion + "/user", require("./routes/user"));
app.use(apiVersion + "/art", require("./routes/art"));
app.use(apiVersion + "/category", require("./routes/category"));
app.use(apiVersion + "/service", require("./routes/service"));
app.use(apiVersion + "/chat", require("./routes/chat"));
app.use(apiVersion + "/order", require("./routes/order"));

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

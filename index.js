const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const connectWithDb = require("./db/db");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const User = require("./models/user");

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
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },

  allowUpgrades: true,
});

app.use((req, res, next) => {
  res.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("connection", () => {
    console.log("connected");
  });

  socket.on("join", (data) => {
    console.log(data, "data");
    socket.join(data);
  });

  socket.on("SEND_MESSAGE", (data) => {
    console.log(data, "data");
    socket.emit("RECEIVE_MESSAGE", data);
  });

  // We can write our socket event listeners in here...
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

const allowedDomains = ["http://localhost:5173"];

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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const connectWithDb = require("./db/db");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

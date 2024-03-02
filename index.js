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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const http = require("http");
const { Server } = require("socket.io");

connectWithDb();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const YOUR_DOMAIN = 'http://localhost:5173';
// const YOUR_DOMAIN = 'https://www.creativevalley9.com'

const app = express();

// middlewares
app.use(express.static("public"));
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
    // origin: "https://www.creativevalley9.com",
    origin: YOUR_DOMAIN,
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
  "http://localhost:5174",
  "https://sea-turtle-app-jr3nk.ondigitalocean.app",
  "https://www.creativevalley9.com",
  "https://creativevalley9.com",
];

app.use(
  cors({
    // origin: "http://24.199.70.115",
  
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

app.post('/create-payment-intent', async (req, res) => {
  const { artId, price, product_type,product_image } = req.body;

  console.log(artId, price, "artId, price")
  console.log(product_type,product_image, "product_type,product_image")

  try {
    // const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const session = await await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
           
            unit_amount: price * 100,
            product_data: {
              name: product_type,
              images: [product_image],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,



      // amount: price * 100,
      // currency: "inr",
      // // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });

    console.log(session, "paymentIntent")
  
    res.send({
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error creating checkout session');
  }
});

app.post('/create-payment-intent-cart', async (req, res) => {
  const { line_items } = req.body;


  try {
    // const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const session = await await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,



      // amount: price * 100,
      // currency: "inr",
      // // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });

    console.log(session, "paymentIntent")
  
    res.send({
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error creating checkout session');
  }
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

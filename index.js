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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = process.env.BASE_PAYPAL_URL

const http = require("http");
const { Server } = require("socket.io");
const { default: axios } = require("axios");

connectWithDb();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const YOUR_DOMAIN = "http://localhost:5173";
// const YOUR_DOMAIN = 'https://www.creativevalley9.com'
const YOUR_DOMAIN = 'https://www.creativevalley9.in'

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
  "https://www.creativevalley9.in",
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
app.use(apiVersion + "/artReview", require("./routes/artReviews"));
// artReview 10.09.24

// app.post('/create-payment-intent', async (req, res) => {
//   const { artId, price, product_type,product_image } = req.body;

//   console.log(artId, price, "artId, price")
//   console.log(product_type,product_image, "product_type,product_image")

//   try {
//     // const { items } = req.body;

//     // Create a PaymentIntent with the order amount and currency
//     const session = await await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',

//             unit_amount: price * 100,
//             product_data: {
//               name: product_type,
//               images: [product_image],
//             },
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${YOUR_DOMAIN}/success`,
//       cancel_url: `${YOUR_DOMAIN}/cancel`,

//       // amount: price * 100,
//       // currency: "inr",
//       // // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//       // automatic_payment_methods: {
//       //   enabled: true,
//       // },
//     });

//     console.log(session, "paymentIntent")

//     res.send({
//       checkoutUrl: session.url,
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Error creating checkout session');
//   }
// });

app.post("/create-payment-intent-cart", async (req, res) => {
  const { line_items } = req.body;

  try {
    // const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const session = await await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,

      // amount: price * 100,
      // currency: "inr",
      // // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });

    console.log(session, "paymentIntent");

    res.send({
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error creating checkout session");
  }
});

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};


const PORT = process.env.PORT || 8080;

// console.log(`Attempting to start server on port ${PORT}`);
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

const createOrder = async (price) => {
  console.log("create Order called");
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log("price====>", price);
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: parseInt(price),
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          brand_name: "CreativeValley.com",
          user_action: "PAY_NOW",
          shipping_preference: 'NO_SHIPPING',
          return_url: `${YOUR_DOMAIN}/success`, // Replace with your success URL
          cancel_url: `${YOUR_DOMAIN}/cancel`, // Replace with your cancel URL
        },
      },
    },
    // application_context: {
    //   return_url: `${YOUR_DOMAIN}/success`, // Replace with your success URL
    //   cancel_url: `${YOUR_DOMAIN}/cancel`, // Replace with your cancel URL
    // },
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// createOrder route
app.post("/api/orders", async (req, res) => {
  try {
    const { price } = req.body;
    console.log("price1====>", price);
    const { jsonResponse, httpStatusCode } = await createOrder(price);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

// captureOrder route
app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    console.log("Capture Order called");
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}); // serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./checkout.html"));
});

const cloudinary = require("cloudinary");
const Art = require("../models/art");
const Order = require("../models/Order");
const ArtReviews = require("../models/ArtReviews");
const nodemailer = require("nodemailer");


exports.createArt = async (req, res) => {
  try {
    let index = 0;
    const imagesList = {};

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded" });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file in files) {
      try {
        console.log(files[file]?.tempFilePath);

        const result = await cloudinary.v2.uploader.upload(
          files[file]?.tempFilePath,
          {
            folder: "artcreativevally",
            crop: "scale",
          }
        );

        imagesList[index] = {
          public_id: result?.public_id,
          secure_url: result?.secure_url,
        };

        index++;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    console.log(req.body, "req.body");

    if (req.body.title === "") {
      return res.status(400).json({ message: "Art should have title" });
    }

    req.body.art = imagesList;

    const newArt = await Art.create(req.body);

    res.status(200).send(newArt);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllArt = async (req, res) => {
  try {
    const getAllArt = await Art.find();

    res.status(200).send(getAllArt);
  } catch (error) {
    res.status(500).send(err);
  }
};

exports.getArtById = async (req, res) => {
  try {
    const getArtById = await Art.findById(req.query.id);

    if (!getArtById) {
      return res.status(400).json({ message: "No Such Art found" });
    }

    res.status(200).send(getArtById);
  } catch (error) {
    res.status(500).send(err);
  }
};

// todo: update art

// todo: delete art
exports.deleteArt = async (req, res) => {
  try {
    const deletedArtItem = await Art.deleteOne({
      _id: req.query.id,
    });

    if (!deletedArtItem) {
      res.status(400).json({ message: "No such item to be deleted" });
    }

    res.status(200).send(deletedArtItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createArtReview = async (req, res) => {
  try {
    console.log(req.query.orderId, "req.query.orderId");
    console.log(req.body, "req.body");

    const orderDetails = await Order.findById(req.query.orderId).populate(
      "user"
    );

    if (!orderDetails) {
      return res.status(400).json({ message: "No such order found" });
    }

    console.log(orderDetails, "orderDetails");

    const payload = {
      username: orderDetails?.user?._id,
      artId: orderDetails?.art?.id,
      reviewTitle: req.body.reviewTitle,
    };

    console.log(payload, "payload");

    const newArtReview = await ArtReviews.create(payload);
    await Order.findByIdAndUpdate(req.query.orderId, {
      $set: {
        reviewId: newArtReview._id,
      },
    });

    res.status(200).send(newArtReview);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send(error);
  }
};

// get reviews by art id
exports.getArtReviewsByArtId = async (req, res) => {
  try {
    const getArtReviews = await ArtReviews.find({
      artId: req.query.id,
    })
      .populate("username", "name")
      .sort({ createdAt: -1 });

    console.log(getArtReviews, "getArtReviews");

    res.status(200).send(getArtReviews);
  } catch (error) {
    res.status(500).send(error);
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


exports.contactUs = (req,res)=>{
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // or any desired recipient email
      subject: "New Message Received",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Details saved and email sent successfully" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
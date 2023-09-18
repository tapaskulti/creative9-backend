const Service = require("../models/service");
const cloudinary = require("cloudinary");

exports.createService = async (req, res) => {
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
            folder: "servicecreativevally",
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

    console.log(JSON.parse(req.body.basicDetails), "req.body BASIC");

    if (req.body.title === "") {
      return res.status(400).json({ message: "Art should have title" });
    }

    req.body.picture = imagesList;
    req.body.categoryDetail = req.query.categoryId;
    const newArt = await Service.create(req.body);

    res.status(200).send(newArt);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({
      categoryDetail: req.query.categoryId,
    }).populate("categoryDetail");

    res.status(200).send(services);
  } catch (error) {
    res.status(500).send(err);
  }
};

exports.getAllServicesForOffer = async (req, res) => {
  try {
    const allServices = await Service.find().populate("categoryDetail");

    res.status(200).send(allServices);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.query.id);

    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(err);
  }
};

exports.updateService = async (req, res) => {};

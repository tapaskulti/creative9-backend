const Service = require("../models/service");

const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
exports.createService = async (req, res) => {
  try {
    let index = 0;
    const imagesList = {};

    // ---- VALIDATION ----
    if (!req.body.title) {
      return res.status(400).json({ message: "Title required" });
    }

    if (!req.body.categoryDetail) {
      return res.status(400).json({ message: "categoryDetail required" });
    }

    // ---- IMAGE UPLOAD ----
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of files) {
        const result = await cloudinary.v2.uploader.upload(
          file.tempFilePath,
          {
            folder: "servicecreativevally",
            crop: "scale",
          }
        );

        imagesList[index] = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };

        index++;
      }
    }

    // ---- SAVE SERVICE ----
   const newService = await Service.create({
  ...req.body,
  picture: imagesList,
  categoryDetail: new mongoose.Types.ObjectId(req.body.categoryDetail),
});

    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    let services = [];

    // If categoryId provided and valid → try filter
    if (req.query.categoryId && mongoose.Types.ObjectId.isValid(req.query.categoryId)) {
      services = await Service.find({
        categoryDetail: new mongoose.Types.ObjectId(req.query.categoryId),
      }).populate("categoryDetail");
    }

    // If no services found → return all services instead
    if (!services.length) {
      services = await Service.find().populate("categoryDetail");
    }

    res.status(200).send(services);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
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

exports.deleteService = async (req,res) => {
  try {
    const deleteServiceItem = await Service.deleteOne({
      _id: req.query.id
    })

    if(!deleteServiceItem){
      res.status(400).json({
        message: "no such illustration found"
      })
    }

    res.status(200).send(deleteServiceItem)

  } catch (error) {
    res.status(500).send(error.message)
  }
}
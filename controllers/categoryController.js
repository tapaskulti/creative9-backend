const Category = require("../models/category");
const cloudinary = require("cloudinary");

exports.createCategory = async (req, res) => {
  try {
    let categoryImageFile;

    if (req.files.categoryImage) {
      categoryImageFile = await cloudinary.v2.uploader.upload(
        req.files.categoryImage.tempFilePath,
        {
          folder: "categorycv",
        }
      );
    }

    const categoryimage = categoryImageFile && {
      id: categoryImageFile?.public_id,
      secure_url: categoryImageFile?.secure_url,
    };

    req.body.picture = categoryimage;

    const newCategory = await Category.create(req.body);

    res.status(200).send(newCategory);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find();

    res.status(200).send(allCategory);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);

    if (!category) {
      res.status(200).send("no such category found");
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

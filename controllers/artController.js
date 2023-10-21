const cloudinary = require("cloudinary");
const Art = require("../models/art");

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
exports.deleteArt = async(req,res) =>{
  try {
    const deletedArtItem = await Art.deleteOne({
      _id: req.query.id
    })

    if(!deletedArtItem){
      res.status(400).json({message:"No such item to be deleted"})
    }

    res.status(200).send(deletedArtItem)

  } catch (error) {
    res.status(500).send(error.message)
  }
}
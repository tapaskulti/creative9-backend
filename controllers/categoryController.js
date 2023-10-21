const category = require("../models/category");
const Category = require("../models/category");
const Portfolio = require("../models/Portfolio")
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

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });

    if (!category) {
      res.status(200).send("no such category found");
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleteCategoryItem = await Category.findByIdAndDelete(req.query.id);

    if (!deleteCategoryItem) {
      res.status(200).send("no such category found");
    }

    res.status(200).send(deleteCategoryItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addPortfolioToCategory = async (req,res)=>{
  try {

    let portfolioImageFile;

    if(req.files.portfolioImage){
      portfolioImageFile = await cloudinary.v2.uploader.upload(
        req.files.portfolioImage.tempFilePath,
        {
          folder: "portfolio"
        }
      )
    }

    const portfolioImage = portfolioImageFile && {
      id: portfolioImageFile?.public_id,
      secure_url: portfolioImageFile?.secure_url
    }

    req.body.picture = portfolioImage


  const response = await Portfolio.create(req.body)
  
  res.status(200).send(response)

    
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.getPortfolioByCategory = async (req,res)=>{
  try { 
    const response =  await Portfolio.find({
      category: req.query.categoryId
    })

    res.status(200).send(response)

  } catch (error) {
    res.status(500).send(error)
  }
}

exports.deletePortfolio = async(req,res)=>{
  try {
    const response = await Portfolio.deleteOne({
      _id: req.query.portfolioId
    })

    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(error)
  }
}
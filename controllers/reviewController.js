const reviewModel = require("../models/ArtReviews");

exports.creatArtReview = async (req, res) => {
  try {
    //  const {userName,reviewTitle} = req.body
    const newReview = await reviewModel.create(req.body);
    return res.status(200).send(newReview);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.getAllReviewByArtId = async (req, res) => {
  try {
    const artReview = await reviewModel.find({
        art: req.query.artId,
    })
    .populate({
        path:"username",
        select:{
            name:1
        }
    })

    return res.status(200).send(artReview);
  } catch (error) {
    return res.status(500).send(error);
  }
};

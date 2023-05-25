exports.createArt = async (req, res) => {
  try {
    if (!req.body.art) {
      res.status(400).send("Art is required");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

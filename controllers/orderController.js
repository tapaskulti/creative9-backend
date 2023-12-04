const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);

    res.status(201).send(newOrder);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deliverPaintingOrder = async (req, res) => {
  try {
    const deliverdOrder = await Order.findOneAndUpdate(
      {
        _id: req.query.id,
      },
      {
        painting_delivery_status: "DELIVERD",
      },
      {
        new: true,
      }
    );

    res.status(200).send(deliverdOrder);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.paidArtOrder = async (req, res) => {
  try {
    const paidOrder = await Order.findOneAndUpdate(
      {
        _id: req.query.id,
      },
      {
        artPaid: true,
      },
      {
        new: true,
      }
    );

    res.status(200).send(paidOrder);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.paidIllustrationOrder = async (req, res) => {
  try {
    const paidOrder = await Order.findOneAndUpdate(
      {
        _id: req.query.id,
      },
      {
        illustrationPaid: true,
      },
      {
        new: true,
      }
    );

    res.status(200).send(paidOrder);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.updateIllustrationStatus = async (req, res) => {
  try {
    const updatedIllustration = await Order.findByIdAndUpdate(
      req.query.id,
      {
        illustration_status: req.body.illustration_status,
      },
      {
        new: true,
      }
    );

    res.status(200).send(updatedIllustration);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showAllOrderdPaintings = async (req, res) => {
  try {
    const allorderedPaintings = await Order.find({
      orderType: "Art",
    }).populate("user");

    res.status(200).send(allorderedPaintings);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showAllOrderdIllustration = async (req, res) => {
  try {
    const allorderedIllustration = await Order.find({
      orderType: "Illustration",
    }).populate("user");

    res.status(200).send(allorderedIllustration);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showUserPaintingOrderList = async (req, res) => {
  try {
    const allorderedPaintings = await Order.find({
      orderType: "Painting",
      user: req.query.userid,
    }).populate("user");

    res.status(200).send(allorderedPaintings);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showUserIllustrationOrderList = async (req, res) => {
  try {
    const allorderedIllustration = await Order.find({
      orderType: "Illustration",
      user: req.query.userid,
    }).populate("user");

    res.status(200).send(allorderedIllustration);
  } catch (error) {
    res.status(500).send(error);
  }
};

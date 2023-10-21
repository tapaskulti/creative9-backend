const { model, Schema } = require("mongoose");

const PortfolioSchema = new Schema({
  category:{
    type: Schema.Types.ObjectId,
    ref:"category"
  },
  
  picture: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  package:{
    type: String,
  
  },
  price:{ 
    type: Number,
  },
  
  
});

module.exports = model("portfolio", PortfolioSchema);

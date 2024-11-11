const mongoose = require("mongoose");

const connectWithDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("MongoDb connected ----> success"))
    .catch((err) => {
      console.log(`DB CONNECTION ISSUE`);
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectWithDb;


// const mongoose = require("mongoose");

// const connectWithDb = async (req, res) => {
//   try {
//     mongoose.set("strictQuery", false);
//     mongoose
//       .connect(process.env.MONGO_URI)
//       mongoose.connection
//       .once("open", () => {
//         console.log("Connected to mongodb");
//       })
//       .on("error", (error) => {
//         console.log("Error connecting to mongodb", error);
//       });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// module.exports = connectWithDb;
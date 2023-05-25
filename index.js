const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const connectWithDb = require("./db/db");

connectWithDb();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config;
let port = process.env.PORT || 5050;

app.use(cors());

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

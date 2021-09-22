const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config;
let port = process.env.PORT || 5050;

app.use(cors());

app.get("/", (req, res) => {
  res.send("This is Backend for Historical Data");
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

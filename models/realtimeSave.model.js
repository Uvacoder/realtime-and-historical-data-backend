const mongoose = require("mongoose");

const realtimeSaveschema = mongoose.Schema({
  temperature: { type: String },
  batteryLevel: { type: String },
  timeStamp: { type: Date },
});

const realtimeSaveModel = mongoose.model(
  "rtHistoricalData",
  realtimeSaveschema
);
module.exports = realtimeSaveModel;

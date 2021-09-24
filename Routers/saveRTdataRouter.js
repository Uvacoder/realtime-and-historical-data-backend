const router = require("express").Router();
const realtimeSaveModel = require("../models/realtimeSave.model");

const getRandomNumbers = () => {
  //it will give random number btwn 0-100
  let num = Math.floor(Math.random() * 100 + 1);
  return num;
};

const getCurrenttimeandDate = () => {
  let currenttimeStamp = new Date().toLocaleString();
  return currenttimeStamp;
};

router.route("/").get((req, res) => {
  setInterval(async () => {
    try {
      let rtData = {
        temperature: getRandomNumbers().toString(),
        batteryLevel: getRandomNumbers().toString(),
        timeStamp: getCurrenttimeandDate(),
      };
      let savedResult = new realtimeSaveModel(rtData);
      let response = await savedResult.save();

      res.send({ Status: "Data inserted", data: response });
    } catch (err) {
      console.log("err" + err);
      res.status(500).send({ Status: "Error", Error: err });
    }
  }, 2000);
});

module.exports = router;

const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
require("dotenv").config();
//port
let port = process.env.PORT || 5050;
//io instance
let io = require("./websocket/websocket").init(server);
const mongoose = require("mongoose");
//models
const realtimeSaveModel = require("./models/realtimeSave.model");
//routers
const rtSavedataRouter = require("./Routers/saveRTdataRouter");

//interval ID
var interValID;

const atlas_uri = process.env.ATLAS_URI;
mongoose.connect(atlas_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoConnection = mongoose.connection;

mongoConnection.once("open", () => {
  console.log("MongoDB connected");
});
// steps to connect mongoose
//1 create uri
//2 connect mongoose with uri and set protocols
//3 create instance for mongoose connection
//4 add event for open to create connection

app.use(express.json());
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//routers
app.use("/savert", rtSavedataRouter); //to save realtime data

const getRandomNumbers = () => {
  //it will give random number btwn 0-100
  let num = Math.floor(Math.random() * 100 + 1);
  return num;
};

const getCurrenttimeandDate = () => {
  let currenttimeStamp = new Date().toLocaleString();
  return currenttimeStamp;
};

const saveRealTimeData = () => {
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
};

app.get("/", (req, res) => {
  res.send("This is Backend for Historical Data");
});

app.get("/getrtdata", async (req, res) => {
  let data = await realtimeSaveModel.find().limit(10).sort({ timeStamp: -1 });
  res.send(data);
});

app.post("/getsorteddata", async (req, res) => {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let data = await realtimeSaveModel.find({
    timeStamp: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  res.send(data);
});

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("join", () => {
    setInterval(async () => {
      const data = await realtimeSaveModel
        .find()
        .limit(10)
        .sort({ timeStamp: -1 });
      io.emit("showrtdata", data);
    }, 1000);
  });
  socket.on("savert-data", (msg) => {
    if (msg) {
      interValID = setInterval(async () => {
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
    } else {
      clearInterval(interValID);
    }

    console.log(msg);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    interValID && clearInterval(interValID);
    //io.emit("user-disconnected", "NAN");
  });
});

//saveRealTimeData();

server.listen(port, () => {
  console.log(`Server started at ${port}`);
});

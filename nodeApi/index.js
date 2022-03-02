const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;


//connect to mongoDB database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, (err, db) => {
  if(err){
      console.log(err);
  }
  else{
      console.log("Connected to mongoDB");
  }
});

//import cors to allow cross origin resource sharing
const cors = require("cors");
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 
  }));

//use the body-parser middleware to parse the request body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
  next();
});

//configure routes
const userRouter = require("./src/routes/user.router");
app.use("/api/user/", userRouter);
const messageRouter = require("./src/routes/message.router");
app.use("/api/message/", messageRouter);
const authRouter = require("./src/routes/auth.router");
app.use("/api/auth/", authRouter);


//listen for requests
const server =app.listen(port, () => console.log(`Listening on port ${port}`));

//socket connection
var socket = require('socket.io')
var { uiSocket } = require('./src/webSocket/socket');
var io = socket(server, {cors: {origin: "*"}});
uiSocket(io);
global.io = io
module.exports = {
  socket
}
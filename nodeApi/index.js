const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express();


//import cors to allow cross origin resource sharing
const cors = require("cors");
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
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


//connect to mongoDB database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, (err, db) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected to mongoDB");
    }
});


app.listen(process.env.PORT, () => {
    console.log('Example app listening on port  ' + process.env.PORT);
});
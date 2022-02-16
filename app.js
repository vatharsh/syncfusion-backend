const path= require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const syncFusionGridTreeRoutes = require('./routes/syncfusion');
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false,limit: '50mb'}));
app.use("/api/images",express.static(path.join(__dirname,"images")));



app.use((freq,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Request-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
})

app.use("/api/syncfusion",syncFusionGridTreeRoutes);

module.exports= app;

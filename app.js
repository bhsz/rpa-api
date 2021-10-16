// ****** Table of contents ******
//
// 0. Dependencies
// 1. Setup and Initialisation
// 2. Configure RPA endpoint
// 3. Run RPA server
//
// *******************************

// 0. Dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const rpaRouter = require("./routes/rpaRouter");
const startServe = require("./utils/runner");

// 1. Setup and Initialisation
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 2. Configure RPA endpoint
app.use("/", rpaRouter);

// 3. Run RPA server
startServe();

module.exports = app;

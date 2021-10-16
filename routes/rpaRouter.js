// ****** Table of contents ******
//
// 0. Dependencies
// 1. Setup
// 2. RPA endpoint
//
// *******************************

// 0. Dependencies
const express = require("express");
const bucket = require("../utils/bucket");

// 1. Setup
const router = express.Router();

// 2. RPA endpoint
router.get("/", async (req, res) => {
	// Add request and response object to bucket
	bucket.push([req, res]);
});

module.exports = router;

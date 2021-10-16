// This idea is very much based on leaky bucket

// ****** Table of contents ******
//
// 0. Dependencies
// 1. Configurations
// 2. Serves request in bucket if possible
// 3. Runner to serve request every serveInterval ms
//
// *******************************

// 0. Dependencies
const bucket = require("./bucket");
const rpa = require("./rpa");

// 1. Configurations
const serveInterval = 1500;
let runners = 4;

// 2. Serves request in bucket if possible
const serve = async () => {
	// Run if runners are available and there are requests to be served
	if (runners != 0 && bucket.length != 0) {
		// Get the first request and response object from bucket
		const head = bucket.shift();
		const req = head[0];
		const res = head[1];

		// Run RPA
		--runners;
		try {
			const data = await rpa(req);
			res.send(data);
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		} finally {
			++runners;
		}
	}
};

// 3. Runner to serve request every serveInterval ms
const startServe = () => {
	setInterval(() => {
		serve();
	}, serveInterval);
};

module.exports = startServe;

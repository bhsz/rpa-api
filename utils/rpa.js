// ****** Table of contents ******
//
// 0. Dependencies
// 1. Cache setup
// 2. Main RPA function
// 3. RPA runner to fetch data
//
// *******************************

// 0. Dependencies
// https://pptr.dev/
const puppeteer = require("puppeteer");
// https://www.npmjs.com/package/node-cache
const NodeCache = require("node-cache");

// 1. Cache setup
const cache = new NodeCache({ stdTTL: 300 });

// 2. Main RPA function
const rpa = async (req) => {
	// Extract arguments
	const position = req.query.position;
	// Check cache
	if (cache.has(position)) {
		return cache.get(position);
	}

	// Initialisation
	const browser = await puppeteer.launch();
	const page = (await browser.pages())[0];

	// Fix from https://github.com/puppeteer/puppeteer/issues/665 for headless
	await page.setExtraHTTPHeaders({
		"Accept-Language": "en-US,en;q=0.9",
	});
	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
	);

	// Fetch data
	data = await fetchData(page, { position });

	// Close browser and return
	await browser.close();
	return data;
};

// 3. RPA runner to fetch data
const fetchData = async (page, args) => {
	// Go to url
	await page.goto("https://www.jobstreet.com.my/en/career-insights");

	// Input role and press search
	await page.type("#role-search", args["position"]);
	let buttons = await page.$x("/html/body/div/div/div/section[1]/div/div/section/button");
	await buttons[0].click();

	// Collect results into JSON
	let results = {};

	let mostCommonSalaryHandle = await page.waitForXPath(
		"/html/body/div[1]/div/div/div[2]/div[2]/div/section/div[2]/div/div[1]/div[1]/p[2]"
	);
	let mostCommonSalary = await page.evaluate((elem) => elem.textContent, mostCommonSalaryHandle);
	results["Most common salary"] = mostCommonSalary;
	let averageSalaryHandle = await page.waitForXPath(
		"/html/body/div[1]/div/div/div[2]/div[2]/div/section/div[2]/div/div[1]/div[2]/p[2]"
	);
	let averageSalary = await page.evaluate((elem) => elem.textContent, mostCommonSalaryHandle);
	results["Average salary"] = mostCommonSalary;

	// Set cache and return results
	cache.set(args["position"], results);
	return results;
};

module.exports = rpa;

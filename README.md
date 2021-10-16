# Express API for Browser RPA

API built on Node and Express to run RPA on a browser.

### Prerequisites

-   [Node](https://nodejs.org/en/download/)

### Quick start

1. Run `npm install` from the root of this repository to resolve dependencies.
2. Run `DEBUG=rpa-express:* npm start` to start the app on your local machine in debug mode.

The RPA script is currently written to extract the most common and average salary from [JobStreet](https://www.jobstreet.com.my/) for a queried position.

To test this out after starting the application, simply send a GET request to `localhost:3000` (change port as needed) with a position query.

For example, `http://localhost:3000/?position=accountant` and `http://localhost:3000/?position=software%20engineer`.

### Code structure

##### app.js

The main entry point to the app. There is nothing much going on here.

##### routes/rpaRouter.js

The RPA endpoint. It simply pushes the request and response object into the bucket as it comes in.

##### utils/bucket.js

The bucket is used as a queue for requests to be served. A singleton array is created to be accessed throughout the program.

##### utils/runner.js

The runner is follows a similar idea as the leaky bucket algorithm. At every interval, if the bucket is not empty and there are runners available, the RPA script will be executed. The interval and number of runners can be configured by changing the variables `serveInterval` and `runners` respectively.

##### utils/rpa.js

This is where the magic happens! This script defines the actual RPA using [Puppeteer](https://pptr.dev/). To change the behaviour of the automation, we need to look into 2 functions - `rpa` and `fetchData`.

-   The `rpa` function does the general "plumbing" - arguments extraction, cache checking, browser initialisation, closing etc. Once everything is setup, it calls the `fetchData` function and returns its results.

-   The `fetchData` function directly interacts with the page. Using the [Puppeteer API](https://pptr.dev/), we are able to simulate browser navigation, button clicks, form submission, data extraction etc. For more information, please check out their [documentation](https://pptr.dev/).

Caching is done with the [node-cache package](https://www.npmjs.com/package/node-cache).

### Algorithm

The flow chart on the left illustrates what the endpoint does.

The flow chart on the right illustrates how requests are served.

![Algorithm flow chart](/diagrams/RPA-flow.png)

### Other Software and Packages

-   [https://github.com/wechaty/wechaty](https://github.com/wechaty/wechaty)
    -   This is not for browser automation, but I've just included this as I thought it's a really interesting package to create bots on Wechat. It would be useful if DOC expands into China someday!
-   [https://www.uipath.com/](https://www.uipath.com/)
    -   Very powerful with support for computer vision.
    -   Needs expensive license for unattended bot and orchestrator.
    -   Huge package!
    -   Only on windows.
-   [https://github.com/tebelorg/RPA-Python](https://github.com/tebelorg/RPA-Python)
    -   Cannot run in parallel on the same machine.
    -   Relative quite slow, simulates actual human being.
-   [http://robotjs.io/](http://robotjs.io/)
    -   Very minimal framework, more for desktop automation and not easy to use with browser.
    -   Takes control over the screen, needs dedicated machine.
-   [https://www.dashblock.com/](https://www.dashblock.com/)
    -   "Dashblock turns any website into an API."
    -   The demo video seems quite cool, but I didn't try this as there is no free plan.
-   [https://webdriver.io/](https://webdriver.io/)
    -   Established and used by many tech companies.
    -   Although it is a browser and mobile automation engine, it was designed mainly for testing. Their documentation has very little support for general automation.
-   [https://pptr.dev/](https://pptr.dev/)
    -   Eureka! Node library for browser automation.
    -   Headless by default.
    -   "Most things that you can do manually in the browser can be done using Puppeteer!"
    -   Relies on selectors, no support for computer vision.
    -   Does Puppeteer work for all cases?
        No, not for desktop/software automation. There is no computer vision support.

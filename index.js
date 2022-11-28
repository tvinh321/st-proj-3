const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// This Chrome Driver is for Chrome Browser 107 !!!!
const service = new chrome.ServiceBuilder('/browser-drivers/chromedriver');
service.start();

const driver = new Builder()
    .forBrowser('chrome')
    .setChromeService(service)
    .build();

const orderingTest = require('./testcases/ordering-system/main');
const moodleTest = require('./testcases/moodle/main');

await orderingTest(driver);
await moodleTest(driver);
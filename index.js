const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// This Chrome Driver is for Chrome Browser 108 !!!!
const service = new chrome.ServiceBuilder('./browser-drivers/chromedriver.exe')

const driver = new Builder()
    .forBrowser('chrome')
    .setChromeService(service)
    .build();

// Import each testcases
const loginTest = require('./testcases/TC-LG');
const enrollTest = require('./testcases/TC-ER');

async function main() {
    await loginTest(driver);
    await enrollTest(driver);
}

main();
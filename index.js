const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// This Chrome Driver is for Chrome Browser 108 !!!!
const service = new chrome.ServiceBuilder("./browser-drivers/chromedriver.exe");

const driver = new Builder()
  .forBrowser("chrome")
  .setChromeService(service)
  .build();

// Import each testcases
const loginTest = require("./testcases/TC-LG");
const logoutTest = require("./testcases/TC-LO");
const enrollTest = require("./testcases/TC-ER");
const downloadTest = require("./testcases/TC-DF");
const blogTest = require('./testcases/TC-BL');

async function main() {
  await loginTest(driver);
  await logoutTest(driver);
  await enrollTest(driver);
  await blogTest(driver);
  await downloadTest(driver);
}

main();

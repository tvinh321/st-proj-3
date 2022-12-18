const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// This Chrome Driver is for Chrome Browser 108 !!!!
const service = new chrome.ServiceBuilder("./browser-drivers/chromedriver.exe");

const options = new chrome.Options();
options.excludeSwitches(["enable-logging"]);

const driver = new Builder()
  .forBrowser("chrome")
  .setChromeService(service)
  .setChromeOptions(options)
  .build();

const firefox = require('selenium-webdriver/firefox');

const firefoxService = new firefox.ServiceBuilder('./browser-drivers/geckodriver.exe');

const firefoxOptions = new firefox.Options();
firefoxOptions.setBinary('C:\\Program Files\\Mozilla Firefox\\firefox.exe');

const firefoxDriver = new Builder()
  .forBrowser('firefox')
  .setFirefoxService(firefoxService)
  .setFirefoxOptions(firefoxOptions)
  .build();

// Import each testcases
const loginTest = require("./testcases/TC-LG");
const logoutTest = require("./testcases/TC-LO");
const enrollTest = require("./testcases/TC-ER");
const downloadTest = require("./testcases/TC-DF");
const blogTest = require("./testcases/TC-BL");
const assignmentSubmissionTest = require("./testcases/TC-AS.js");
const removeAssignmentTest = require("./testcases/TC-RA.js");
const courseSearchTest = require("./testcases/TC-CS.js");
const courseViewTest = require("./testcases/TC-CV.js");
const responsiveTest = require("./testcases/TC-RE.js");
const sessionTest = require("./testcases/TC-SE.js");
const attemptQuizTest = require("./testcases/TC-AQ.js");

async function main() {
  await driver.manage().window().setRect({ width: 900, height: 1080 });
  await firefoxDriver.manage().window().setRect({ width: 900, height: 1080 });

  // await loginTest(driver);
  // await logoutTest(driver);
  // await enrollTest(driver);
  // await blogTest(driver);
  // await downloadTest(driver);
  // await assignmentSubmissionTest(driver);
  // await removeAssignmentTest(driver);
  // await courseSearchTest(driver);
  // await courseViewTest(driver);
  // await responsiveTest(driver);
  // await sessionTest(driver);
  await attemptQuizTest(driver);

  // await loginTest(firefoxDriver);
  // await logoutTest(firefoxDriver);
  // await enrollTest(firefoxDriver);
  // await blogTest(firefoxDriver);
  // await downloadTest(firefoxDriver);
  // await assignmentSubmissionTest(firefoxDriver);
  // await removeAssignmentTest(firefoxDriver);
  // await courseSearchTest(firefoxDriver);
  // await courseViewTest(firefoxDriver);
  // await responsiveTest(firefoxDriver);
  // await sessionTest(firefoxDriver);
  await attemptQuizTest(firefoxDriver);
}

main();

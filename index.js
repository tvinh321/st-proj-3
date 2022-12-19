const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { PageLoadStrategy } = require("selenium-webdriver/lib/capabilities.js");

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
const updateAssignmentTest = require("./testcases/TC-UA.js");
const urlTest = require("./testcases/TC-URL.js");
const messageTest = require("./testcases/TC-MS.js");
const viewForumTest = require("./testcases/TC-VF.js");
const addForumTest = require("./testcases/TC-AD.js");
const gradeAsm = require("./testcases/TC-GA.js");
const pageLoadTest = require("./testcases/TC-PL.js");
const addA = require("./testcases/TC-AA.js");
const replyForum = require("./testcases/TC-RF.js");
const attemptQuizTest = require("./testcases/TC-AQ.js");
const addChoiceTest = require("./testcases/TC-AC.js");

const fs = require("fs");
const fileNames = [1, 5, 9, 10, 11];

fileNames.forEach((fileName) => {
  // If file name "test{fileName}mb.pdf" exists in ./data/submission, duplicate it
  if (fs.existsSync(`./data/submission/test${fileName}mb.pdf`)) {
    fs.copyFileSync(
      `./data/submission/test${fileName}mb.pdf`,
      `./data/submission/test${fileName}mb - Copy.pdf`
    );

    fs.copyFileSync(
      `./data/submission/test${fileName}mb.pdf`,
      `./data/submission/test${fileName}mb - Copy (2).pdf`
    );
  }
});

async function main() {
  await driver.manage().window().setRect({ width: 900, height: 1080 });
  await firefoxDriver.manage().window().setRect({ width: 900, height: 1080 });

  console.log("Chrome Testing Started");
  await loginTest(driver);
  await logoutTest(driver);
  await enrollTest(driver);
  await blogTest(driver);
  await downloadTest(driver);
  await assignmentSubmissionTest(driver);
  await removeAssignmentTest(driver);
  await courseSearchTest(driver);
  await courseViewTest(driver);
  await responsiveTest(driver);
  await sessionTest(driver);
  await updateAssignmentTest(driver);
  await urlTest(driver);
  await messageTest(driver);
  await viewForumTest(driver);
  await addForumTest(driver);
  await gradeAsm(driver);
  await pageLoadTest(driver);
  await addA(driver);
  await replyForum(driver);
  await attemptQuizTest(driver);
  await addChoiceTest(driver);

  console.log("Firefox Testing Started");
  await loginTest(firefoxDriver);
  await logoutTest(firefoxDriver);
  await enrollTest(firefoxDriver);
  await blogTest(firefoxDriver);
  await downloadTest(firefoxDriver);
  await assignmentSubmissionTest(firefoxDriver);
  await removeAssignmentTest(firefoxDriver);
  await courseSearchTest(firefoxDriver);
  await courseViewTest(firefoxDriver);
  await responsiveTest(firefoxDriver);
  await sessionTest(firefoxDriver);
  await updateAssignmentTest(firefoxDriver);
  await urlTest(firefoxDriver);
  await messageTest(firefoxDriver);
  await viewForumTest(firefoxDriver);
  await addForumTest(firefoxDriver);
  await gradeAsm(firefoxDriver);
  await pageLoadTest(firefoxDriver);
  await addA(firefoxDriver);
  await replyForum(firefoxDriver);
  await attemptQuizTest(firefoxDriver);
  await addChoiceTest(firefoxDriver);
}

main();

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { PageLoadStrategy } = require("selenium-webdriver/lib/capabilities.js");

// This Chrome Driver is for Chrome Browser 108 !!!!
const service = new chrome.ServiceBuilder("./browser-drivers/chromedriver.exe");

// options.add_experimental_option('excludeSwitches', ['enable-logging'])
const options = new chrome.Options();
options.excludeSwitches(["enable-logging"]);

const driver = new Builder()
  .forBrowser("chrome")
  .setChromeService(service)
  .setChromeOptions(options)
  .build();

// Import each testcases
// const loginTest = require("./testcases/TC-LG");
// const logoutTest = require("./testcases/TC-LO");
// const enrollTest = require("./testcases/TC-ER");
// const downloadTest = require("./testcases/TC-DF");
// const blogTest = require("./testcases/TC-BL");
// const assignmentSubmissionTest = require("./testcases/TC-AS.js");
// const removeAssignmentTest = require("./testcases/TC-RA.js");
// const courseSearchTest = require("./testcases/TC-CS.js");
// const courseViewTest = require("./testcases/TC-CV.js");
// const responsiveTest = require("./testcases/TC-RE.js");
// const sessionTest = require("./testcases/TC-SE.js");
// const updateAssignmentTest = require("./testcases/TC-UA.js");
// const urlTest = require("./testcases/TC-URL.js");
// const messageTest = require("./testcases/TC-MS.js");
// const viewForumTest = require("./testcases/TC-VF.js");
// const addForumTest = require("./testcases/TC-AD.js");
// const gradeAsm = require("./testcases/TC-GA.js");
const pageLoadTest = require("./testcases/TC-PL.js");


async function main() {
  await driver.manage().window().setRect({ width: 900, height: 1080 });

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
  // await updateAssignmentTest(driver);
  // await urlTest(driver);
  // await messageTest(driver);
  // await viewForumTest(driver);
  // await addForumTest(driver);
  // await gradeAsm(driver);
  await pageLoadTest(driver);
}

main();

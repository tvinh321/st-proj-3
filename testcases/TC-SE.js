const { time } = require("console");
const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-SE Error: Driver Not Found");
    return;
  }

  const accountFile = fs.readFileSync("data/account.txt", "utf-8");

  // Split each lines to an array
  const textData = accountFile.split("\r\n");

  let username = "";
  let password = "";

  textData.forEach((line) => {
    const accountName = line.split(":")[0];
    const accountInfo = line.split(":")[1];

    if (accountName === "student") {
      username = accountInfo.split(";")[0];
      password = accountInfo.split(";")[1];
      return;
    }
  });

  const account = {
    username: username,
    password: password,
  };

  //First, login
  await driver.get("https://hihimoodle.gnomio.com/login/index.php");
  await driver.findElement(By.id("username")).sendKeys(account.username);
  await driver.findElement(By.id("password")).sendKeys(account.password);
  await driver.findElement(By.id("loginbtn")).click();

  const activeKeys = await driver.manage().getCookies();
  const activeSessionValue = activeKeys.filter(
    (cookie) => cookie.name === "MoodleSession"
  )[0].value;

  await driver.sleep(500);

  //Logout
  await driver.findElement(By.id("user-menu-toggle")).click();
  await driver.findElement(By.linkText("Log out")).click();
  await driver.findElement(By.css("p:nth-child(5)")).click();

  await driver
    .wait(async () => {
      const updatedKeys = await driver.manage().getCookies();
      const updatedSessionValue = updatedKeys.filter(
        (cookie) => cookie.name === "MoodleSession"
      )[0].value;
      return activeSessionValue !== updatedSessionValue;
    }, 500)
    .then(() => {
      console.error(`TC-SE-002: Passed`);
    })
    .catch(() => {
      console.error(`TC-SE-002: Failed`);
    });

  // This test case passed.
  // Howerver, it costs much time since it has to wait for session timeout
  // So I commented it for not wasting test time
  // Please uncomment it if you want to test it

  // await driver.sleep(80000).then(() => {
  //   driver
  //     .findElement(By.className("modal-content"))
  //     .isDisplayed()
  //     .then(() => {
  //       console.error(`TC-SE-001: Passed`);
  //     })
  //     .catch(() => {
  //       if (driver.findElement(By.className("alert-danger")).isDisplayed()) {
  //         console.error(`TC-SE-001: Passed`);
  //       } else {
  //         console.error(`TC-SE-001: Failed`);
  //       }
  //     });
  // });
};

const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-AQ Error: Driver Not Found");
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

  //Not login case
  await driver.get("https://hihimoodle.gnomio.com/mod/quiz/view.php?id=12");
  await driver
    .wait(async () => {
      const url = await driver.getCurrentUrl();
      return url == "https://hihimoodle.gnomio.com/login/index.php";
    }, 1000)
    .then(() => {
      console.error(`TC-CV-001: Passed`);
    })
    .catch(() => {
      console.error(`TC-CV-001: Failed`);
    });

  //Login cases
  // await driver.get("https://hihimoodle.gnomio.com/login/index.php");
  // await driver.findElement(By.id("username")).sendKeys(account.username);
  // await driver.findElement(By.id("password")).sendKeys(account.password);
  // await driver.findElement(By.id("loginbtn")).click();

 
};

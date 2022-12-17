const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-LO Error: Driver Not Found");
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
  await driver.get("https://hihimoodle.gnomio.com/course/view.php?id=2");
  await driver.findElement(By.id("username")).sendKeys(account.username);
  await driver.findElement(By.id("password")).sendKeys(account.password);
  await driver.findElement(By.id("loginbtn")).click();

  //Download file
  await driver.findElement(By.css("#module-4 .aalink")).click();

  await driver.manage().window().setRect({ width: 500, height: 720 });

  await driver
    .wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.contains(".pdf");
    }, 5000)
    .then(() => {
      console.error(`TC-DF-001 Passed`);
    })
    .catch(() => {
      console.error(`TC-DF-001 Failed`);
    });
};

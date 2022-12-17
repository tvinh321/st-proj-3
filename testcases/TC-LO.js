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
  await driver.get("https://hihimoodle.gnomio.com/login/index.php");
  await driver.findElement(By.id("username")).sendKeys(account.username);
  await driver.findElement(By.id("password")).sendKeys(account.password);
  await driver.findElement(By.id("loginbtn")).click();

  //Logout
  await driver.findElement(By.id("user-menu-toggle")).click();
  await driver.findElement(By.linkText("Log out")).click();
  await driver.findElement(By.css("p:nth-child(5)")).click();

  await driver
    .wait(async () => {
      const url = await driver.getCurrentUrl();
      return url === "https://hihimoodle.gnomio.com/";
    }, 500)
    .then(() => {
      console.error(`TC-LO-001 Passed`);
    })
    .catch(() => {
      console.error(`TC-LO-001 Failed`);
    });
};

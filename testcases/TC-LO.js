const assert = require("assert");
const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-LO Error: Driver Not Found");
    return;
  }

  const username = "student";
  const password = "stuDent123!";

  await driver.get("https://hihimoodle.gnomio.com/login/index.php");
  await driver.findElement(By.id("username")).sendKeys(username);
  await driver.findElement(By.id("password")).sendKeys(password);
  await driver.findElement(By.id("loginbtn")).click();
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

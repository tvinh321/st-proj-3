const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-LO Error: Driver Not Found");
    return;
  }

  // Read Data from Login Testcase Data
  const data = fs.readFileSync("data/account.txt", "utf-8");
  const accountData = data.split("\r\n");

  //Login Test with each data
  for (let i = 0; i < accountData.length; i++) {
    const account = accountData[i].split(":")[1].split(";");
    const username = account[0];
    const password = account[1];

    await driver.get("https://hihimoodle.gnomio.com/login/index.php");

    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("password")).clear();

    await driver.findElement(By.id("username")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(password);
    await driver.findElement(By.id("loginbtn")).click();

    //Logout
    await driver.get("https://hihimoodle.gnomio.com/login/logout.php");

    await driver
      .findElement(By.xpath(`//h4[contains(.,'Confirm')]`))
      .isDisplayed()
      .then(() => {
        console.log(`TC-LO-00${i + 1}: Passed`);
      })
      .catch(() => {
        console.error(`TC-LO-00${i + 1}: Failed`);
      });

    await driver
      .findElement(By.xpath("//button[contains(.,'Continue')]"))
      .click();
  }
};

const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-RE Error: Driver Not Found");
    return;
  }

  // Get Account Data
  const accounts = fs.readFileSync("data/account.txt", "utf-8");

  // Split each lines to an array
  const textData = accounts.split("\r\n");

  let username = "";
  let password = "";

  textData.forEach((line) => {
    const accountName = line.split(":")[0];
    const accountInfo = line.split(":")[1];

    if (accountName === "student") {
      username = accountInfo.split(";")[0];
      password = accountInfo.split(";")[1];
    }
  });

  // Login Student Account
  await driver.get("https://hihimoodle.gnomio.com/login/logout.php");
  if ((await driver.getCurrentUrl()) !== "https://hihimoodle.gnomio.com/") {
    await driver
      .findElement(By.xpath("//button[contains(.,'Continue')]"))
      .click();
  }

  await driver.get("https://hihimoodle.gnomio.com/login/index.php");

  await driver.findElement(By.id("username")).clear();
  await driver.findElement(By.id("password")).clear();

  await driver.findElement(By.id("username")).sendKeys(username);
  await driver.findElement(By.id("password")).sendKeys(password);
  await driver.findElement(By.id("loginbtn")).click();
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return url === "https://hihimoodle.gnomio.com/my/";
  }, 5000);

  const responsive = fs.readFileSync("data/responsive.txt", "utf-8");

  const responsiveArray = responsive.split("\r\n");

  for (let i = 0; i < responsiveArray.length; i++) {
    const responsiveLink = responsiveArray[i];

    await driver.get(responsiveLink);

    // Find meta viewport tag that contains width=device-width, initial-scale=1.0
    await driver
      .findElement(By.xpath("//meta[@name='viewport']"))
      .getAttribute("content")
      .then((content) => {
        if (content.includes("width=device-width, initial-scale=1.0")) {
          console.log(`TC-RE-00${i + 1}: Passed`);
        } else {
          console.error(`TC-RE-00${i + 1}: Failed`);
        }
      })
      .catch((err) => {
        console.error(`TC-RE-00${i + 1}: Failed`);
      });
  }
};
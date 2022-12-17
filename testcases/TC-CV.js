const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-CV Error: Driver Not Found");
    return;
  }

  //No login case
  await driver.get("https://hihimoodle.gnomio.com/course/view.php?id=2");
  await driver
    .wait(async () => {
      const url = await driver.getCurrentUrl();
      return url == "https://hihimoodle.gnomio.com/login/index.php";
    }, 1000)
    .then(() => {
      console.error(`TC-CV-001 Passed`);
    })
    .catch(() => {
      console.error(`TC-CV-001 Failed`);
    });

  //Login cases
  const dataFile = fs.readFileSync("data/courseview.txt", "utf-8");
  const textData = dataFile.split("\r\n");

  for (let i = 0; i < textData.length; i++) {
    const data = textData[i].split(":")[1].split(";");
    const username = data[0];
    const password = data[1];
    const courseId = data[2];
    const status = data[3];

    await driver.get(
      `https://hihimoodle.gnomio.com/course/view.php?id=${courseId}`
    );

    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("password")).clear();
    await driver.findElement(By.id("username")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(password);
    await driver.findElement(By.id("loginbtn")).click();

    if (status === "success") {
      driver
        .findElement(By.linkText("Grades"))
        .isDisplayed()
        .then(() => {
          console.log(`TC-CV-00${i + 2}: Passed`);
        })
        .catch(() => {
          console.log(`TC-CV-00${i + 2}: Failed`);
        });
    }
  }
};

const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-CS Error: Driver Not Found");
    return;
  }

  const keywords = fs.readFileSync("data/coursesearch.txt", "utf-8");
  const keywordArray = keywords.split("\r\n");

  //No need to Login
  await driver.get("https://hihimoodle.gnomio.com/course/");

  for (let i = 0; i < keywordArray.length; i++) {
    const keyword = keywordArray[i].split(":")[1].split(";");
    const key = keyword[0];
    const status = keyword[1];

    await driver.findElement(By.className("form-control")).clear();
    await driver.findElement(By.className("form-control")).sendKeys(key);
    await driver.findElement(By.css(".fa-search")).click();

    if (status === "success") {
      driver
        .findElement(By.xpath(`//h2[contains(.,'Search results')]`))
        .isDisplayed()
        .then(() => {
          console.log(`TC-CS-00${i + 1}: Passed`);
        })
        .catch(() => {
          console.log(`TC-CS-00${i + 1}: Failed`);
        });
    } else if (status === "failed") {
      driver
        .findElement(By.xpath(`//h2[contains(.,'No courses were found')]`))
        .isDisplayed()
        .then(() => {
          console.log(`TC-CS-00${i + 1}: Passed`);
        })
        .catch(() => {
          console.log(`TC-CS-00${i + 1}: Failed`);
        });
    }
  }
};

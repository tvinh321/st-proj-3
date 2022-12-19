const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-URL Error: Driver Not Found");
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


    const gotourl = await fs.readFileSync(
        "data/url.txt",
        "utf-8"
    );
    const gotourlArray = gotourl.split("\r\n");

    for (let i = 0; i < gotourlArray.length; i++) {
        const urlLink = gotourlArray[i].split(":")[1].split(";");
        const urlId = urlLink[0];
        const urlStatus = urlLink[1];
        // await driver.get(urlLink);

        await driver.get(`https://hihimoodle.gnomio.com/mod/url/view.php?id=${urlId}`);
    
        const urlClick = await driver.findElement(By.className("urlworkaround"))
        .then(
          (element) => {
            return element;
          },
          (error) => {
            return null;
          }
        );
    
        if (urlClick && urlStatus === "success") {
          await urlClick.click()
          .then(
            (element) => {
              console.log(`TC-RA-00${i + 1}: Passed`);
            },
            (error) => {
              console.error(`TC-RA-00${i + 1}: Failed`);
            }
          );
        }
        else {
          console.error(`TC-RA-00${i + 1} Error: Unknown Situation`);
        }
      }
};

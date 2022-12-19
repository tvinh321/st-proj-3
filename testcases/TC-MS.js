const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-MS Error: Driver Not Found");
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


    const message = await fs.readFileSync(
        "data/message.txt",
        "utf-8"
    );
    const messageArray = message.split("\r\n");

    for (let i = 0; i < messageArray.length; i++) {
        const msg = messageArray[i].split(":")[1].split(";");
        const msgTask = msg[0];
        const msgStatus = msg[1];
        // await driver.get(urlLink);

        // View testing
        await driver.findElement(By.xpath("//a[@data-region='popover-region-messages']")).click();
        const starred = await driver.findElement(By.xpath("//span[contains(.,'Starred')]"))
        .then(
            (element) => {
              return element;
            },
            (error) => {
              return null;
            }
        );
        if (starred && msgStatus === "success")
            console.log(`TC-MS-00${i + 1}: Passed`);
        else 
            console.error(`TC-MS-00${i + 1}: Failed`);
    
    }
};

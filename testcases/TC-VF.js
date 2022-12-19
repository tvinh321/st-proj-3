const fs = require("fs");
const { By, Key } = require("selenium-webdriver");

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


    const forum = await fs.readFileSync(
        "data/viewForum.txt",
        "utf-8"
    );
    const forumArray = forum.split("\r\n");

    const forumData = forumArray[0].split(":")[1].split(";");
    const forumId = forumData[0];
    const forumStatus = forumData[1];

    await driver.findElement(By.linkText("My courses")).click()
    await driver.sleep(2000);
    await driver.get('https://hihimoodle.gnomio.com/course/view.php?id=2');
    await driver.sleep(2000);
    await driver.get(`https://hihimoodle.gnomio.com/mod/forum/view.php?id=${forumId}`);
    const addForum = await driver.findElement(By.xpath("//a[contains(.,'Add discussion topic')]"))
    .then(
        (element) => {
            console.log(`TC-VF-00${1}: Passed`);
        },
        (error) => {
            console.log(`TC-VF-00${1}: Failed`);
        }
      );

};

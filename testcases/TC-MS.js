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


    const message = await fs.readFileSync(
        "data/message.txt",
        "utf-8"
    );
    const messageArray = message.split("\r\n");
    
    // View testing
        const msg = messageArray[0].split(":")[1].split(";");
        const msgTask = msg[0];
        const msgStatus = msg[1];

        await driver.findElement(By.css(".fa-comment-o")).click()
        const grouped = await driver.findElement(By.css("#view-overview-group-messages-toggle .collapsed-icon-container > .icon"))
        .then(
            (element) => {
              return element;
            },
            (error) => {
              return null;
            }
        );
        if (grouped && msgStatus === "success")
            console.log(`TC-MS-00${1}: Passed`);
        else 
            console.log(`TC-MS-00${1}: Failed`);

    // Search testing
        const msg1 = messageArray[1].split(":")[1].split(";");
        const msgTask1 = msg1[0];
        const msgStatus1 = msg1[1];

        await driver.findElement(By.css(".simplesearchform:nth-child(1) > .form-control")).click()
        await driver.findElement(By.css(".input-group:nth-child(2) > .form-control")).sendKeys("Student Student")
        await driver.findElement(By.css(".input-group:nth-child(2) > .form-control")).sendKeys(Key.ENTER)
        const foundStudent =  await driver.findElement(By.className("list-group"))
        .then(
            (element) => {
              return element;
            },
            (error) => {
              return null;
            }
        );
        
        if (foundStudent && msgStatus1 === "success")
            console.log(`TC-MS-00${2}: Passed`);
        else
            console.error(`TC-MS-00${2}: Failed`);
    
    // Send testing
        const msg2 = messageArray[2].split(":")[1].split(";");
        const msgTask2 = msg2[0];
        const msgStatus2 = msg2[1];

        await driver.sleep(5000);

        await driver.findElement(By.xpath("/html/body/div[3]/div[7]/div/div[3]/div[6]/div[1]/div/div[1]/div[2]/div")).click()
        await driver.sleep(5000);
        await driver.findElement(By.xpath("/html/body/div[3]/div[7]/div/div[4]/div[1]/div[1]/div[2]/textarea")).click()
        await driver.sleep(5000);
        await driver.findElement(By.xpath("/html/body/div[3]/div[7]/div/div[4]/div[1]/div[1]/div[2]/textarea")).sendKeys(msgTask2);
        await driver.findElement(By.css(".fa-paper-plane")).click()
        // await driver.findElement(By.css(".mt-auto")).click()
        const sentmsg = driver.findElement(By.xpath(`//div[contains(.,'${msgTask2}')]`))
        .then(
            (element) => {
              return element;
            },
            (error) => {
              return null;
            }
        );
        
        if (sentmsg && msgStatus2 === "success")
            console.log(`TC-MS-00${3}: Passed`);
        else
            console.error(`TC-MS-00${3}: Failed`);
    // Delete Testing
        const msg3 = messageArray[3].split(":")[1].split(";");
        const msgTask3 = msg3[0];
        const msgStatus3 = msg3[1];

        await driver.findElement(By.css(".fa-ellipsis-h")).click()
        await driver.sleep(5000);
        await driver.findElement(By.linkText("Delete conversation")).click()
        await driver.sleep(5000);
        await driver.findElement(By.css(".btn-primary:nth-child(8)")).click()
        await driver.sleep(5000);
        const msglost = driver.findElement(By.xpath("//p[contains(.,'Personal space')]"))
        .then(
            (element) => {
              return element;
            },
            (error) => {
              return null;
            }
        );
        if (msglost && msgStatus3 === "success")
            console.log(`TC-MS-00${4}: Passed`);
        else
            console.error(`TC-MS-00${4}: Failed`);
};

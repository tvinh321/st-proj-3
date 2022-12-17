const fs = require('fs');
const { By } = require('selenium-webdriver')

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-ER Error: Driver Not Found");
        return;
    }

    // Get Account Data
    const accounts = fs.readFileSync('data/account.txt', 'utf-8');

    // Split each lines to an array
    const textData = accounts.split('\r\n');
        
    let username = "";
    let password = "";

    textData.forEach(line => {
        const accountName = line.split(':')[0];
        const accountInfo = line.split(':')[1];

        if (accountName === "teacher") {
            username = accountInfo.split(';')[0];
            password = accountInfo.split(';')[1];
        }
    })

    // Login Teacher Account
    await driver.get("https://hihimoodle.gnomio.com/login/logout.php");
    if ((await driver.getCurrentUrl()) !== "https://hihimoodle.gnomio.com/") {
        await driver.findElement(By.xpath("//button[contains(.,'Continue')]")).click();
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

    const userData = await fs.readFileSync('data/enroll.txt', 'utf-8');
    const userDataArray = userData.split('\r\n');

    for (let i = 0; i < userDataArray.length; i++) {
        await driver.get("https://hihimoodle.gnomio.com/user/index.php?id=2")

        const role = userDataArray[i].split(':')[0];
        const email = userDataArray[i].split(':')[1].split(';')[0];

        await driver.findElement(By.css("#enrolusersbutton-1 .btn")).click();

        await driver.sleep(5000);

        await driver.findElement(By.xpath("//div[3]/input")).sendKeys("")
        await driver.findElement(By.xpath("//div[3]/input")).sendKeys(email)
        await driver.findElement(By.xpath("//span[contains(.,'▼')]")).click()

        await driver.sleep(5000);

        await driver.findElement(By.xpath("//li/span/span")).click()

        await driver.sleep(1000);

        const modal = await driver.findElement(By.className("modal-title"));
        await modal.click();

        await driver.sleep(1000);

        if (role === "teacher") {
            await driver.findElement(By.id("id_roletoassign")).sendKeys("Non-editing teacher");
        }

        await driver.findElement(By.xpath("//button[contains(.,'Enrol users')]")).click()

        await driver.sleep(5000);

        let result = await driver.findElement(By.id("user-index-participants-2_r0_c2")).getText() == email;
        
        if (role === "student") {
            result = result && await driver.findElement(By.css("#user-index-participants-2_r0_c3 .quickeditlink")).getText() == "Student"
        } else if (role === "teacher") {
            result = result && await driver.findElement(By.css("#user-index-participants-2_r0_c3 .quickeditlink")).getText() == "Non-editing teacher"
        }

        if (result) {
            console.log(`TC-ER-00${i+1}: Passed`);
        } else {
            console.error(`TC-ER-00${i+1}: Failed`);
            return
        }
    }
}
const fs = require('fs');
const { By } = require('selenium-webdriver')

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-LG Error: Driver Not Found");
        return;
    }

    // Read Data from Login Testcase Data
    const data = fs.readFileSync('data/login.txt', 'utf-8');

    // Split each lines to an array
    const textData = data.split('\r\n');
        
    // Extract Login Data from each lines
    const loginData = textData.map(line => {
        const accountInfo = line.split(':')[1];
        const loginInfo = accountInfo.split(';');

        return {
            username: loginInfo[0],
            password: loginInfo[1],
            status: loginInfo[2]
        }
    })

    // Login Test with each data
    for (let i = 0; i < loginData.length; i++) {
        const username = loginData[i].username;
        const password = loginData[i].password;
        const status = loginData[i].status;

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

        if (status === "success") {
            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url === "https://hihimoodle.gnomio.com/my/";
            }, 5000);
            console.log(`TC-LG-00${i+1}: Passed`);
        }
        else if (status === "failed") {
            await driver.wait(async () => {
                const url = await driver.getCurrentUrl();
                return url === "https://hihimoodle.gnomio.com/login/index.php";
            }, 5000);
            console.log(`TC-LG-00${i+1}: Passed`);
        }
        else {
            console.error(`TC-LG-00${i+1} Error: Status Input Invalid`);
        }
    }

    // Special Testcase: Login as Guest
    await driver.get("https://hihimoodle.gnomio.com/login/logout.php");
    if (driver.getCurrentUrl() !== "https://hihimoodle.gnomio.com/") {
        await driver.findElement(By.xpath("//button[contains(.,'Continue')]")).click();
    }

    await driver.get("https://hihimoodle.gnomio.com/login/index.php");
    await driver.findElement(By.id("loginguestbtn")).click();
    await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url === "https://hihimoodle.gnomio.com/";
    }, 5000)
    .catch(() => {
        console.error(`TC-LG-00${loginData.length+1}: Failed`);
    });
    
    console.log(`TC-LG-00${loginData.length+1}: Passed`);
}
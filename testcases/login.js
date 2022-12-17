const fs = require('fs');
const { By } = require('selenium-webdriver')

module.exports = async function main(driver) {
    if (!driver) {
        console.error("Login Test Error: Driver Not Found");
        return;
    }

    // Read Data from Login Testcase Data
    fs.readFile('data/login.txt', 'utf-8', async (err, data) => {
        if (err) {
            console.error("Login Test Error: Can't read login.txt");
            return;
        }

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

        for (let i = 0; i < loginData.length; i++) {
            const username = loginData[i].username;
            const password = loginData[i].password;
            const status = loginData[i].status;

            await driver.get("https://hihimoodle.gnomio.com/login/index.php");
            await driver.findElement(By.id("username")).sendKeys(username);
            await driver.findElement(By.id("password")).sendKeys(password);
            await driver.findElement(By.id("loginbtn")).click();

            if (status === "success") {
                await driver.wait(async () => {
                    const url = await driver.getCurrentUrl();
                    return url === "https://hihimoodle.gnomio.com/my/";
                }, 5000);
                console.log(`Login Test: Case ${i + 1} Passed`);
            }
            else if (status === "failed") {
                await driver.wait(async () => {
                    const url = await driver.getCurrentUrl();
                    return url === "https://hihimoodle.gnomio.com/login/index.php";
                }, 5000);
                console.log(`Login Test: Case ${i + 1} Passed`);
            }
            else {
                console.error(`Login Test: Case ${i + 1} Error: Status Input Invalid`);
            }
        }
    })
}
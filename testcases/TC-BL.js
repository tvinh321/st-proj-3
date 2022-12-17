const fs = require('fs');
const { By } = require('selenium-webdriver')

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-BL Error: Driver Not Found");
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

        if (accountName === "student") {
            username = accountInfo.split(';')[0];
            password = accountInfo.split(';')[1];
        }
    })

    // Login Student Account
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

    const blogs = await fs.readFileSync('data/blog.txt', 'utf-8');

    const blogsArray = blogs.split('\r\n');

    for (let i = 0; i < blogsArray.length; i++) {
        await driver.get('https://hihimoodle.gnomio.com/blog/edit.php?action=add');
        
        await driver.manage().window().setRect({ width: 900, height: 1080 });

        const blogData = blogsArray[i].split(':')[1].split(';');

        const blogTitle = blogData[0];
        const blogContent = blogData[1];
        const blogStatus = blogData[2];
        
        await driver.findElement(By.id("id_subject")).sendKeys(blogTitle);
        await driver.findElement(By.id("id_summary_editoreditable")).sendKeys(blogContent);

        await driver.sleep(2000);

        if (i === blogsArray.length - 1) {
            // Get Absolute Path of File
            const filePath = fs.realpathSync('data/submission/test1mb.pdf');
            await driver.findElement(By.className("fp-btn-add")).click();
            await driver.sleep(3000);
            await driver.findElement(By.name("repo_upload_file")).sendKeys(filePath);
            await driver.findElement(By.className("fp-upload-btn")).click();
            await driver.sleep(3000);
        }

        await driver.findElement(By.id("id_submitbutton")).click();

        await driver.sleep(3000);
        
        if (blogStatus === "success") {
            const url = await driver.getCurrentUrl();
            if (url.includes("https://hihimoodle.gnomio.com/blog/index.php")) {
                console.log(`TC-BL-00${i+1} Passed`);
            }
            else {
                console.error(`TC-BL-00${i+1} Failed`);
            }
        }
        else if (blogStatus === "failed") {
            const url = await driver.getCurrentUrl();
            if (url === "https://hihimoodle.gnomio.com/blog/edit.php?action=add") {
                console.log(`TC-BL-00${i+1} Passed`);
            }
            else {
                console.error(`TC-BL-00${i+1} Failed`);
            }
        }
        else {
            console.error(`TC-BL-00${i+1}: Invalid Blog Status`);
            return;
        }
    }
}
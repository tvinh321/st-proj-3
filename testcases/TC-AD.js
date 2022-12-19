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
        "data/addForum.txt",
        "utf-8"
    );
    const forumArray = forum.split("\r\n");
// 0 filled fields testing
    const forumData0 = forumArray[0].split(":")[1].split(";");
    const forumSubject0 = forumData0[0];
    const forumMsg0 = forumData0[1];
    const forumStatus0 = forumData0[2];
    await driver.findElement(By.linkText("My courses")).click()
    await driver.sleep(2000);
    await driver.get('https://hihimoodle.gnomio.com/course/view.php?id=2');
    await driver.sleep(2000);
    await driver.get('https://hihimoodle.gnomio.com/mod/forum/view.php?id=6');
    await driver.sleep(2000);
    const addForum = await driver.findElement(By.xpath("//a[contains(.,'Add discussion topic')]"))
    .then(
        (element) => {
            return element;
        },
        (error) => {
            return null;
        }
    );
    if (addForum){
        await addForum.click();
        await driver.sleep(2000);
        await driver.findElement(By.id("id_submitbutton")).click()
        await driver.sleep(2000);
        const submitBtn = await driver.findElement(By.id("id_submitbutton"))
        if (submitBtn && forumStatus0 === "failed")
            console.log(`TC-AD-00${1}: Passed`);
        else 
            console.log(`TC-AD-00${1}: Failed`);
    }

// subject filled testing
    const forumData1 = forumArray[1].split(":")[1].split(";");
    const forumSubject1 = forumData1[0];
    const forumMsg1 = forumData1[1];
    const forumStatus1 = forumData1[2];
    await driver.findElement(By.id("id_subject")).click()
    await driver.findElement(By.id("id_subject")).sendKeys("abc")
    await driver.sleep(2000);
    await driver.findElement(By.id("id_submitbutton")).click()
    await driver.sleep(2000);
    const submitBtn1 = await driver.findElement(By.id("id_submitbutton"))
        if (submitBtn1 && forumStatus1 === "failed")
            console.log(`TC-AD-00${2}: Passed`);
        else 
            console.log(`TC-AD-00${2}: Failed`);

// message filled testing
const forumData2 = forumArray[2].split(":")[1].split(";");
const forumSubject2 = forumData2[0];
const forumMsg2 = forumData2[1];
const forumStatus2 = forumData2[2];
await driver.findElement(By.id("id_subject")).clear()
await driver.sleep(2000);
await driver.findElement(By.id("id_messageeditable")).click()
await driver.sleep(5000);
await driver.findElement(By.id("id_messageeditable")).sendKeys("abc")
{
    const element = await driver.findElement(By.id("id_messageeditable"))
    await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = 'abc'}", element)
}
await driver.sleep(2000);
await driver.findElement(By.id("id_submitbutton")).click()
await driver.sleep(2000);
const submitBtn2 = await driver.findElement(By.id("id_submitbutton"))
    if (submitBtn2 && forumStatus2 === "failed")
        console.log(`TC-AD-00${2}: Passed`);
    else 
        console.log(`TC-AD-00${2}: Failed`);

// 2 filled fields testing
    const forumData3 = forumArray[3].split(":")[1].split(";");
    const forumSubject3 = forumData3[0];
    const forumMsg3 = forumData3[1];
    const forumStatus3 = forumData3[2];

    await driver.findElement(By.id("id_subject")).click()
    await driver.findElement(By.id("id_subject")).sendKeys("abc")
    await driver.sleep(2000);
    await driver.findElement(By.id("id_messageeditable")).click()
    await driver.sleep(5000);
    await driver.findElement(By.id("id_messageeditable"))
    {
        const element = await driver.findElement(By.id("id_messageeditable"))
        await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = 'abc'}", element)
    }
    await driver.findElement(By.id("id_submitbutton")).click()
    {
        const element = await driver.findElement(By.css("#page-mod-forum-view > div:nth-child(1)"))
        await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = '1 <p>1</p>'}", element)
    }

    await driver.sleep(5000);

    const submitBtn3 = await driver.findElement(By.xpath("//a[contains(.,'abc')]"))
    if (submitBtn3)
        console.log(`TC-AD-00${3}: Passed`);
    else 
        console.log(`TC-AD-00${3}: Failed`);
    
};

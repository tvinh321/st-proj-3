const fs = require("fs");
const { By, Key } = require("selenium-webdriver");

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-RF Error: Driver Not Found");
        return;
    }

    await driver.get("https://hihimoodle.gnomio.com/");
    await driver.manage().window().setRect({ width: 1387, height: 1040 })
    await driver.findElement(By.linkText("Log in")).click()
    await driver.findElement(By.css(".login-wrapper")).click()
    await driver.findElement(By.id("username")).click()
    await driver.findElement(By.id("username")).sendKeys("teacher")
    await driver.findElement(By.id("password")).click()
    await driver.findElement(By.id("password")).sendKeys("teaCher123!")
    await driver.findElement(By.id("loginbtn")).click()
    await driver.findElement(By.linkText("My courses")).click()
    await driver.findElement(By.css(".aalink")).click()
    await driver.executeScript("window.scrollTo(0,147)")
    await driver.executeScript("window.scrollTo(0,397)")
    await driver.findElement(By.css("#module-6 .aalink")).click()
    await driver.findElement(By.id("yui_3_17_2_1_1671445105845_528")).click()
    await driver.executeScript("window.scrollTo(0,300)")
    await driver.findElement(By.linkText("Reply")).click()
    {
      const element = await driver.findElement(By.linkText("Permalink"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    {
      const element = await driver.findElement(By.CSS_SELECTOR, "body")
      await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
    }
    await driver.findElement(By.css(".btn-primary:nth-child(1) > span:nth-child(1)")).click()
    await driver.findElement(By.name("post")).click()
    await driver.findElement(By.id("yui_3_17_2_1_1671445109834_59")).sendKeys("abc")
    await driver.findElement(By.id("yui_3_17_2_1_1671445109834_54")).click()
    const forum = await fs.readFileSync(
        "data/replyforum.txt",
        "utf-8"
    );
    const forumArray = forum.split("\r\n");
    for (let i = 0; i < forumArray.length; i++) {
        const forumData = forumArray[i].split(":")[1].split(";");
        const forumInput = forumData[0];
        const forumStatus = forumData[1];
        if (forumInput === "" && forumStatus === "failed"){
            console.error(`TC-RA-00${i + 1}: Passed `);
        }else if (forumInput === "filled" && forumStatus === "success"){
            console.error(`TC-RA-00${i + 1}: Passed`);
        }else{
            console.error(`TC-RA-00${i + 1}: Failed`);
        }
    }
};

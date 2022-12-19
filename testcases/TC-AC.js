const fs = require("fs");
const { By, Key } = require("selenium-webdriver");

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-AC Error: Driver Not Found");
        return;
    }

    await driver.get("https://hihimoodle.gnomio.com/");
    await driver.manage().window().setRect({ width: 1398, height: 1024 })
    await driver.findElement(By.linkText("Log in")).click()
    await driver.findElement(By.id("username")).click()
    await driver.findElement(By.id("username")).sendKeys("teacher")
    await driver.findElement(By.id("password")).sendKeys("teaCher123!")
    await driver.findElement(By.id("password")).sendKeys(Key.ENTER)
    await driver.executeScript("window.scrollTo(0,0)")
    await driver.findElement(By.linkText("My courses")).click()
    await driver.executeScript("window.scrollTo(0,25)")
    await driver.findElement(By.css(".aalink")).click()
    await driver.findElement(By.id("63a040e5ed73763a040e5e71555-editingswitch")).click()
    await driver.findElement(By.css("#coursecontentcollapse0 > .btn")).click()
    await driver.findElement(By.linkText("Choice")).click()
    await driver.executeScript("window.scrollTo(0,261)")
    {
      const element = await driver.findElement(By.css("#page-mod-choice-mod > div:nth-child(1)"))
      await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = '1 <p>1</p>'}", element)
    }
    await driver.findElement(By.id("id_submitbutton")).click()

    const submitbtn = await driver.findElement(By.id("id_submitbutton"))

    if (submitbtn)
        console.log(`TC-AD-00${1}: Passed`);
    else 
        console.log(`TC-AD-00${1}: Failed`);

    await driver.findElement(By.id("id_name")).click()
    await driver.findElement(By.id("id_name")).sendKeys("abc")
    await driver.findElement(By.id("id_option_0")).click()
    await driver.findElement(By.id("id_option_0")).sendKeys("abc")
    await driver.findElement(By.css(".grippy-host")).click()
    await driver.findElement(By.id("id_submitbutton")).click()
    await driver.executeScript("window.scrollTo(0,8)")

    const submitbtn2 = await driver.findElement(By.id("id_submitbutton"))

    if (!submitbtn2)
        console.log(`TC-AD-00${2}: Passed`);
    else 
        console.log(`TC-AD-00${2}: Failed`);

};

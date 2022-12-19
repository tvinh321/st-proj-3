const fs = require("fs");
const { By, Key } = require("selenium-webdriver");

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-AA Error: Driver Not Found");
        return;
    }

    await driver.get("https://hihimoodle.gnomio.com/");
    await driver.manage().window().setRect({ width: 1387, height: 1024 })
    await driver.findElement(By.linkText("Log in")).click()
    await driver.findElement(By.id("username")).click()
    await driver.findElement(By.id("username")).sendKeys("teacher")
    await driver.findElement(By.id("password")).click()
    await driver.findElement(By.id("password")).sendKeys("teaCher123!")
    await driver.findElement(By.id("password")).sendKeys(Key.ENTER)
    await driver.findElement(By.linkText("My courses")).click()
    await driver.findElement(By.css(".aalink")).click()
    await driver.executeScript("window.scrollTo(0,0)")
    await driver.findElement(By.css("#module-1 .aalink")).click()
    await driver.findElement(By.id("yui_3_17_2_1_1671444189530_515")).click()
    await driver.findElement(By.id("id_submitbutton")).click()
    const submitbtn = await driver.findElement(By.id("id_submitbutton"))

    if (submitbtn)
        console.log(`TC-AD-00${1}: Passed`);
    else 
        console.log(`TC-AD-00${1}: Failed`);

    await driver.findElement(By.id("id_subject")).click()
    await driver.findElement(By.id("id_subject")).sendKeys("abc")
    await driver.findElement(By.id("id_messageeditable")).click()
    await driver.findElement(By.id("id_message")).sendKeys("<p dir=\"ltr\" style=\"text-align: left;\">a</p>")
    await driver.findElement(By.id("id_message")).sendKeys("<p dir=\"ltr\" style=\"text-align: left;\">ab</p>")
    await driver.findElement(By.id("id_message")).sendKeys("<p dir=\"ltr\" style=\"text-align: left;\">abc</p>")
    {
      const element = await driver.findElement(By.id("id_messageeditable"))
      await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = '<p dir=\"ltr\" style=\"text-align: left;\">abc</p>'}", element)
    }
    await driver.findElement(By.id("id_advancedadddiscussion")).click()
    await driver.findElement(By.id("collapseElement-1")).click()
    await driver.findElement(By.id("id_timestart_enabled")).click()
    await driver.findElement(By.id("id_timeend_day")).click()
    {
      const dropdown = await driver.findElement(By.id("id_timeend_day"))
      await dropdown.findElement(By.xpath("//option[. = '20']")).click()
    }
    await driver.findElement(By.id("id_timeend_enabled")).click()
    await driver.findElement(By.id("collapseElement-2")).click()
    await driver.findElement(By.id("form_autocomplete_input-1671444208293")).click()
    await driver.findElement(By.id("form_autocomplete_input-1671444208293")).sendKeys("abc")
    await driver.findElement(By.id("yui_3_17_2_1_1671444207984_796")).click()
    {
      const element = await driver.findElement(By.id("id_submitbutton"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    {
      const element = await driver.findElement(By.CSS_SELECTOR, "body")
      await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
    }
    await driver.findElement(By.id("id_submitbutton")).click()
    {
      const element = await driver.findElement(By.css(".close:nth-child(3)"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    const submitbtn2 = await driver.findElement(By.id("id_submitbutton"))
    
    if (!submitbtn2)
        console.log(`TC-AD-00${2}: Passed`);
    else 
        console.log(`TC-AD-00${2}: Failed`);
};

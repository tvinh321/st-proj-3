const fs = require("fs");
const { By, Key } = require("selenium-webdriver");

module.exports = async function main(driver) {
    if (!driver) {
        console.error("TC-AC Error: Driver Not Found");
        return;
    }

    await driver.get("https://hihimoodle.gnomio.com/");

};

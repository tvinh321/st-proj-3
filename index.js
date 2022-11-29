const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// This Chrome Driver is for Chrome Browser 107 !!!!
const service = new chrome.ServiceBuilder('./browser-drivers/chromedriver.exe')

const driver = new Builder()
    .forBrowser('chrome')
    .setChromeService(service)
    .build();

// Import each testcases
const test1 = require('./testcases/test1');

test1(driver);
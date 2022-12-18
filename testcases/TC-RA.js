const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-RA Error: Driver Not Found");
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

  // Login Student Account
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

  const removeassignment = await fs.readFileSync(
    "data/removeassignment.txt",
    "utf-8"
  );

  const removeassignmentArray = removeassignment.split("\r\n");

  for (let i = 0; i < removeassignmentArray.length; i++) {
    const assignmentData = removeassignmentArray[i].split(":")[1].split(";");
    const assignmentId = assignmentData[0];
    const assignmentStatus = assignmentData[1];

    await driver.get(`https://hihimoodle.gnomio.com/mod/assign/view.php?id=${assignmentId}`);

    const removeButton = await driver.findElement(By.xpath("//button[contains(.,'Remove submission')]"))
    .then(
      (element) => {
        return element;
      },
      (error) => {
        return null;
      }
    );

    if (removeButton && assignmentStatus === "success") {
      await removeButton.click();

      await driver.findElement(By.xpath("//button[contains(.,'Continue')]")).click();
      
      await driver.sleep(1000);

      await driver.findElement(By.xpath("//button[contains(.,'Add submission')]"))
      .then(
        (element) => {
          console.log(`TC-RA-00${i + 1}: Passed`);
        },
        (error) => {
          console.error(`TC-RA-00${i + 1}: Failed`);
        }
      );
    }
    else if (removeButton && assignmentStatus === "overdue") {
      console.error(`TC-RA-00${i + 1}: Failed`);
    }
    else if (!removeButton && assignmentStatus === "success") {
      console.error(`TC-RA-00${i + 1}: Failed: No Remove Button Found or Assignment is not submitted`);
    }
    else if (!removeButton && assignmentStatus === "overdue") {
      console.log(`TC-RA-00${i + 1}: Passed`);
    }
    else {
      console.error(`TC-RA-00${i + 1} Error: Unknown Situation`);
    }
  }
};
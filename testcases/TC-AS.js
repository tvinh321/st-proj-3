const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-AS Error: Driver Not Found");
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

  const assignmentsubmit = await fs.readFileSync(
    "data/assignmentsubmit.txt",
    "utf-8"
  );

  const assignmentsubmitArray = assignmentsubmit.split("\r\n");

  for (let i = 0; i < assignmentsubmitArray.length; i++) {
    const assignmentData = assignmentsubmitArray[i].split(":")[1].split(";");
    const assignmentResult = assignmentData[assignmentData.length - 2];
    let addButtonDisplayed = true;
    let maxSizeError = false;

    await driver.get(
      "https://hihimoodle.gnomio.com/mod/assign/view.php?id=2&action=removesubmissionconfirm"
    );
    await driver.findElement(By.css(".btn-primary")).click();

    await driver.get(
      "https://hihimoodle.gnomio.com/mod/assign/view.php?id=2&action=editsubmission"
    );
    await driver.sleep(5000);

    for (let j = 0; j < assignmentData.length - 2; j++) {
      const assignment = assignmentData[j];
      const filePath = fs.realpathSync(`data/submission/${assignment}`);

      if (
        assignmentResult === "maxfile" &&
        !(await driver.findElement(By.className("fp-btn-add")).isDisplayed())
      ) {
        addButtonDisplayed = false;
        break;
      }

      await driver.findElement(By.className("fp-btn-add")).click();
      await driver.sleep(5000);
      await driver.findElement(By.name("repo_upload_file")).sendKeys(filePath);
      await driver.findElement(By.className("fp-upload-btn")).click();
      await driver.sleep(5000);

      if (assignmentResult === "maxsize") {
        let errorText = await driver
          .findElement(By.xpath("//div[9]/div[3]/div/div[2]/div/div"))
          .then((element) => {
            return element.getText();
          })
          .catch(() => {
            return "";
          });

        if (errorText === "") {
          errorText = await driver
            .findElement(By.xpath("//div[10]/div[3]/div/div[2]/div/div"))
            .then((element) => {
              return element.getText();
            })
            .catch(() => {
              return "";
            });
        }

        if (errorText.includes("The maximum size you can upload is 10 MB.")) {
          console.log(`TC-AS-00${i + 1}: Passed`);
          maxSizeError = true;
          break;
        } else {
          console.log(`TC-AS-00${i + 1}: Failed`);
        }
      }
    }

    if (assignmentResult === "maxsize" && maxSizeError) {
      continue;
    }

    if (assignmentResult === "maxfile") {
      if (addButtonDisplayed) {
        console.log(`TC-AS-00${i + 1}: Failed`);
      } else {
        console.log(`TC-AS-00${i + 1}: Passed`);
      }

      await driver.findElement(By.id("id_cancel")).click();

      continue;
    }

    await driver.findElement(By.id("id_submitbutton")).click();
    await driver.sleep(3000);

    if (assignmentResult === "success") {
      let result = true;
      for (let j = 0; j < assignmentData.length - 2; j++) {
        const assignment = assignmentData[j];
        driver
          .findElement(By.xpath(`//a[contains(.,'${assignment}')]`))
          .isDisplayed()
          .then(() => {
            result = true;
          })
          .catch(() => {
            result = false;
          });
      }

      if (result) {
        console.log(`TC-AS-00${i + 1}: Passed`);
      } else {
        console.log(`TC-AS-00${i + 1}: Failed`);
      }
    } else if (assignmentResult === "nofile") {
      const errorText = String(
        await driver.findElement(By.xpath("//section/div[2]/div")).getText()
      );
      const result = errorText.includes("Nothing was submitted");

      if (result) {
        console.log(`TC-AS-00${i + 1}: Passed`);
      } else {
        console.log(`TC-AS-00${i + 1}: Failed`);
      }
    }
  }
};

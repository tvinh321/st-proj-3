const fs = require("fs");
const { By } = require("selenium-webdriver");

module.exports = async function main(driver) {
  if (!driver) {
    console.error("TC-AQ Error: Driver Not Found");
    return;
  }

  const accountFile = fs.readFileSync("data/account.txt", "utf-8");

  // Split each lines to an array
  const textData = accountFile.split("\r\n");

  let username = "";
  let password = "";

  textData.forEach((line) => {
    const accountName = line.split(":")[0];
    const accountInfo = line.split(":")[1];

    if (accountName === "student") {
      username = accountInfo.split(";")[0];
      password = accountInfo.split(";")[1];
      return;
    }
  });

  const account = {
    username: username,
    password: password,
  };

  //Not login case
  await driver.get("https://hihimoodle.gnomio.com/mod/quiz/view.php?id=12");
  await driver
    .wait(async () => {
      const url = await driver.getCurrentUrl();
      return url == "https://hihimoodle.gnomio.com/login/index.php";
    }, 1000)
    .then(() => {
      console.error(`TC-AQ-001: Passed`);
    })
    .catch(() => {
      console.error(`TC-AQ-001: Failed`);
    });

  //Login cases
  const quizzes = fs.readFileSync("data/attemptquiz.txt", "utf-8");
  const quizArray = quizzes.split("\r\n");

  for (let i = 0; i < quizArray.length; i++) {
    await driver.get("https://hihimoodle.gnomio.com/login/logout.php");
    if ((await driver.getCurrentUrl()) !== "https://hihimoodle.gnomio.com/") {
      await driver
        .findElement(By.xpath("//button[contains(.,'Continue')]"))
        .click();
    }

    const quiz = quizArray[i].split(":")[1].split(";");
    const id = quiz[0];
    const status = quiz[1];

    await driver.get(
      `https://hihimoodle.gnomio.com/mod/quiz/view.php?id=${id}`
    );
    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("password")).clear();
    await driver.findElement(By.id("username")).sendKeys(account.username);
    await driver.findElement(By.id("password")).sendKeys(account.password);
    await driver.findElement(By.id("loginbtn")).click();

    if (status == "success") {
      await driver
        .findElement(By.xpath("//button[contains(.,'Attempt quiz')]"))
        .isDisplayed()
        .then(() => {
          console.log(`TC-AQ-00${i + 2}: Passed`);
        })
        .catch(() => {
          console.log(`TC-AQ-00${i + 2}: Failed`);
        });
    } else if (status == "failed") {
      await driver
        .findElement(By.xpath("//button[contains(.,'Back to the course')]"))
        .isDisplayed()
        .then(() => {
          console.log(`TC-AQ-00${i + 2}: Passed`);
        })
        .catch(() => {
          console.log(`TC-AQ-00${i + 2}: Failed`);
        });
    } else if (status === "notenrolled") {
      await driver
        .wait(async () => {
          const message = await driver.findElement(By.id("notice"));
          return message.getText(`You cannot enrol yourself in this course.`);
        }, 500)
        .then(() => {
          console.log(`TC-AQ-00${i + 2}: Passed`);
        })
        .catch(() => {
          console.log(`TC-AQ-00${i + 2}: Failed`);
        });
    }
  }

  // Special Testcase: Login as Guest
  await driver.get("https://hihimoodle.gnomio.com/login/logout.php");
  if (driver.getCurrentUrl() !== "https://hihimoodle.gnomio.com/") {
    await driver
      .findElement(By.xpath("//button[contains(.,'Continue')]"))
      .click();
  }

  await driver.get(`https://hihimoodle.gnomio.com/mod/quiz/view.php?id=12`);
  await driver.findElement(By.id("loginguestbtn")).click();
  await driver
    .wait(async () => {
      const message = await driver.findElement(By.id("notice"));
      return message.getText(
        `Guests cannot access this course. Please log in.`
      );
    }, 500)
    .then(() => {
      console.log(`TC-AQ-00${quizArray.length + 2}: Passed`);
    })
    .catch(() => {
      console.log(`TC-AQ-00${quizArray.length + 2}: Failed`);
    });
};

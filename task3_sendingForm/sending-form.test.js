const { Builder, By, until } = require("selenium-webdriver");

const path = require("path");

async function setDateOfBirth(driver, { day, month, year }) {
  //
  const dob = await driver.findElement(By.id("dateOfBirthInput"));
  await dob.click();

  const monthSelect = await driver.findElement(
    By.css(".react-datepicker__month-select")
  );
  await monthSelect.sendKeys(month);

  const yearSelect = await driver.findElement(
    By.css(".react-datepicker__year-select")
  );
  await yearSelect.sendKeys(String(year));

  const dayElement = await driver.findElement(
    By.xpath(
      `//div[contains(@class, 'react-datepicker__day') and not(contains(@class, 'outside-month')) and normalize-space()='${day}']`
    )
  );
  await dayElement.click();
}

async function addSubject(driver, subject) {
  const input = await driver.findElement(By.id("subjectsInput"));
  await input.sendKeys(subject);
  // Enter to accept suggestion
  await input.sendKeys("\n");
}

async function testSendingForm() {
  const driver = await new Builder().forBrowser("chrome").build();

  const data = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    gender: "Male",
    phoneNumber: "1234567899",
    dateOfBirth: { day: "27", month: "May", year: 2004 },
    subjects: ["Maths", "English", "Social"],
    hobbies: ["Sports", "Music"],
    address: "Warsaw, Poland",
    picture: path.resolve(__dirname, "sample.jpg"),
  };

  const genderIdByValiue = {
    Male: "gender-radio-1",
    Female: "gender-radio-2",
    Other: "gender-radio-3",
  };

  const hobbiesIdByValue = {
    Sports: "hobbies-checkbox-1",
    Reading: "hobbies-checkbox-2",
    Music: "hobbies-checkbox-3",
  };

  try {
    await driver.manage().window().maximize();

    // 1. Go to website
    await driver.get("https://demoqa.com/automation-practice-form");

    // 2. Fill all fields and attach some picture

    // Fill fields
    await driver.findElement(By.id("firstName")).sendKeys(data.firstName);
    await driver.findElement(By.id("lastName")).sendKeys(data.lastName);
    await driver.findElement(By.id("userEmail")).sendKeys(data.email);

    // Gender
    await driver
      .findElement(By.css(`label[for="${genderIdByValiue[data.gender]}"]`))
      .click();

    await driver.findElement(By.id("userNumber")).sendKeys(data.phoneNumber);

    // Date of Birth (calendar)
    await setDateOfBirth(driver, data.dateOfBirth);

    // Subjects (autocomplete)
    for (const s of data.subjects) {
      await addSubject(driver, s);
    }

    // Hobbies
    for (const h of data.hobbies) {
      const hobbyLabel = await driver.findElement(
        By.css(`label[for="${hobbiesIdByValue[h]}"]`)
      );

      await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        hobbyLabel
      );

      await hobbyLabel.click();
    }

    await driver.sleep(10000); // to be removed
  } finally {
    await driver.quit();
  }
}

testSendingForm();

const { Builder, By, until } = require("selenium-webdriver");

const path = require("path");

// Helper functions
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

  // Click specific day (excludes outside-month days)
  const dayElement = await driver.findElement(
    By.xpath(
      `//div[contains(@class, 'react-datepicker__day') and not(contains(@class, 'outside-month')) and normalize-space()='${day}']`
    )
  );
  await dayElement.click();
}

// Formats dateOfBirth object to match modal format: "DD Month,YYYY"
function formatDateForModal({ day, month, year }) {
  return `${day} ${month},${year}`;
}

async function addSubject(driver, subject) {
  // Find autocomplete input, type subject, press Enter to select first suggestion
  const input = await driver.findElement(By.id("subjectsInput"));
  await input.sendKeys(subject);
  // \n simulates Enter key
  await input.sendKeys("\n");
}

// Extracts value from modal table by label
async function getModalValue(driver, label) {
  return (await driver.findElement(
    By.xpath(`//td[normalize-space()="${label}"]/following-sibling::td`)
  ).getText()).trim();
}

async function testSendingForm() {
  const driver = await new Builder().forBrowser("chrome").build();

  // Test data object
  const data = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    gender: "Male",
    phoneNumber: "1234567899",
    dateOfBirth: { day: "27", month: "May", year: 2004 },
    subjects: ["Maths", "English", "Social Studies"],
    hobbies: ["Sports", "Music"],
    address: "F 12, Main",
    picture: path.resolve(__dirname, "sample.jpg"),
    state: "NCR",
    city: "Delhi",
  };

  const genderIdByValue = {
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

    // Remove common ad iframes
    await driver.executeScript(`
      document.querySelectorAll('iframe[id^="google_ads_iframe"]').forEach(el => 
        el.remove());`);

    // 2. Fill all fields and attach some picture

    // Fill fields
    await driver.findElement(By.id("firstName")).sendKeys(data.firstName);
    await driver.findElement(By.id("lastName")).sendKeys(data.lastName);
    await driver.findElement(By.id("userEmail")).sendKeys(data.email);

    // Gender
    await driver
      .findElement(By.css(`label[for="${genderIdByValue[data.gender]}"]`))
      .click();

    // Phone Number
    // Scroll into view first (prevents interception), then type
    const phoneInput = await driver.findElement(By.id("userNumber"));
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", phoneInput);
    await phoneInput.sendKeys(data.phoneNumber);

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

      //
      await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        hobbyLabel
      );

      await hobbyLabel.click();
    }

    // Picture
    await driver.findElement(By.id("uploadPicture")).sendKeys(data.picture);

    // Current Address
    await driver.findElement(By.id("currentAddress")).sendKeys(data.address);

    // State and City
  
    // State
    const stateInput = await driver.findElement(By.id("react-select-3-input"));
    await stateInput.sendKeys(data.state);
    await stateInput.sendKeys("\n");

    // City
    const cityInput = await driver.findElement(By.id("react-select-4-input"));
    await cityInput.sendKeys(data.city);
    await cityInput.sendKeys("\n");

    // 3. Click Submit button
    await driver.findElement(By.id("submit")).click();

    // 4. Make sure all the data that appears in the modal window is correct 
    // and matches what you entered
    await driver.wait(until.elementLocated(By.className("modal-content")), 10000);

    const expected = {
      "Student Name": `${data.firstName} ${data.lastName}`,
      "Student Email": data.email,
      "Gender": data.gender,
      "Mobile": data.phoneNumber,
      "Date of Birth": formatDateForModal(data.dateOfBirth),
      "Subjects": data.subjects.join(", "),
      "Hobbies": data.hobbies.join(", "),
      "Picture": "sample.jpg",
      "Address": data.address,
      "State and City": `${data.state} ${data.city}`,
    };

    for(const [label, expectedValue] of Object.entries(expected)) {
      const actualValue = await getModalValue(driver, label);
      if (actualValue !== expectedValue) {
        throw new Error(`Mismatch for "${label}: expected "${expectedValue}", got "${actualValue}"`);
      }
      console.log(`${label}: ${actualValue}`);
    }
    
    console.log("All modal values match input data!");
  } finally {
    await driver.quit();
  }
}

testSendingForm();

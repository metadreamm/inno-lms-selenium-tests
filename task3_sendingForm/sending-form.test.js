/*
1. Go to the https://demoqa.com/automation-practice-form
2. Fill all fields and attach some picture
3. Click Submit button
4. Make sure all the data that appears in the modal window is correct and matches what you entered
*/

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

  // Convert day string to Number to strip leading zeros (e.g., "01" becomes "1").
  // This ensures XPath matches the actual text inside the calendar day cells.
  const dayValue = Number(day);
  const dayElement = await driver.findElement(
    By.xpath(
      `//div[contains(@class, 'react-datepicker__day') and not(contains(@class, 'outside-month')) and normalize-space()='${dayValue}']`
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
  return (
    await driver
      .findElement(
        By.xpath(`//td[normalize-space()="${label}"]/following-sibling::td`)
      )
      .getText()
  ).trim();
}

// Test Data (1 positive + 4 negative)
const testCases = [
  {
    name: "Positive: Full valid data",
    isPositive: true,
    data: {
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
    },
  },
  {
    name: "Negative #1: Short Phone Number",
    isPositive: false,
    data: {
      firstName: "Alex",
      lastName: "Jones",
      email: "alex.jones@example.com",
      gender: "Other",
      phoneNumber: "123",
      dateOfBirth: { day: "27", month: "May", year: 2004 },
      subjects: [],
      hobbies: [],
      address: "",
      picture: "",
      state: "",
      city: "",
    },
  },
  {
    name: "Negative #2: Invalid Email",
    isPositive: false,
    data: {
      firstName: "Jane",
      lastName: "Smith",
      email: "invalidEmail", // Error: no @
      gender: "Female",
      phoneNumber: "1234567890",
      dateOfBirth: { day: "01", month: "January", year: 2000 },
      subjects: [],
      hobbies: [],
      address: "",
      picture: "",
      state: "",
      city: "",
    },
  },
  {
    name: "Negative #3: Empty First Name",
    isPositive: false,
    data: {
      firstName: "", // Error: required field
      lastName: "Jones",
      email: "alex.jones@example.com",
      gender: "Male",
      phoneNumber: "1234567890",
      dateOfBirth: { day: "01", month: "January", year: 2000 },
      subjects: [],
      hobbies: [],
      address: "",
      picture: "",
      state: "",
      city: "",
    },
  },
  {
    name: "Negative #4: No Gender selected",
    isPositive: false,
    data: {
      firstName: "Alex",
      lastName: "Jones",
      email: "alex.jones@example.com",
      gender: null, // Error: required field
      phoneNumber: "1234567890",
      dateOfBirth: { day: "01", month: "January", year: 2000 },
      subjects: [],
      hobbies: [],
      address: "",
      picture: "",
      state: "",
      city: "",
    },
  },
];

async function runTests() {
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

  for (const testCase of testCases) {
    console.log(`\n>>>Runnnig a test: ${testCase.name}`);
    const driver = await new Builder().forBrowser("chrome").build();
    const { data, isPositive } = testCase;

    try {
      await driver.manage().window().maximize();

      // 1. Go to website
      await driver.get("https://demoqa.com/automation-practice-form");

      // Remove common ad iframes
      await driver.executeScript(`
      document.querySelectorAll('iframe[id^="google_ads_iframe"]').forEach(el => 
        el.remove());`);

      // 2. Fill all fields and attach some picture

      // Fill fields (with data checks)
      if (data.firstName)
        await driver.findElement(By.id("firstName")).sendKeys(data.firstName);
      if (data.lastName)
        await driver.findElement(By.id("lastName")).sendKeys(data.lastName);
      if (data.email)
        await driver.findElement(By.id("userEmail")).sendKeys(data.email);

      // Gender
      if (data.gender) {
        const genderLabel = await driver.findElement(
          By.css(`label[for="${genderIdByValue[data.gender]}"]`)
        );
        await genderLabel.click();
      }

      // Phone Number
      // Scroll into view first (prevents interception), then type
      const phoneInput = await driver.findElement(By.id("userNumber"));
      await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        phoneInput
      );
      await phoneInput.sendKeys(data.phoneNumber);

      // Date of Birth (calendar)
      if (data.dateOfBirth) await setDateOfBirth(driver, data.dateOfBirth);

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

      // Picture
      if (data.picture) {
        await driver.findElement(By.id("uploadPicture")).sendKeys(data.picture);
      }

      // Current Address
      if (data.address) {
        await driver
          .findElement(By.id("currentAddress"))
          .sendKeys(data.address);
      }

      // State and City

      // State
      if (data.state) {
        const stateInput = await driver.findElement(
          By.id("react-select-3-input")
        );
        await stateInput.sendKeys(data.state);
        await stateInput.sendKeys("\n");
      }

      // City
      if (data.city) {
        const cityInput = await driver.findElement(
          By.id("react-select-4-input")
        );
        await cityInput.sendKeys(data.city);
        await cityInput.sendKeys("\n");
      }

      // 3. Click Submit button (JS click)
      const submitBtn = await driver.findElement(By.id("submit"));
      await driver.executeScript("arguments[0].click();", submitBtn);

      // 4. Make sure all the data that appears in the modal window is correct
      // and matches what you entered
      if (isPositive) {
        await driver.wait(
          until.elementLocated(By.className("modal-content")),
          5000
        );

        const expected = {
          "Student Name": `${data.firstName} ${data.lastName}`,
          "Student Email": data.email,
          Gender: data.gender,
          Mobile: data.phoneNumber,
          "Date of Birth": formatDateForModal(data.dateOfBirth),
          Subjects: data.subjects.join(", "),
          Hobbies: data.hobbies.join(", "),
          Picture: "sample.jpg",
          Address: data.address,
          "State and City": `${data.state} ${data.city}`,
        };

        // Check every field
        for (const [label, expectedValue] of Object.entries(expected)) {
          const actualValue = await getModalValue(driver, label);
          if (actualValue !== expectedValue) {
            throw new Error(
              `Mismatch for "${label}: expected "${expectedValue}", got "${actualValue}"`
            );
          }
          console.log(`${label}: ${actualValue}`);
        }

        console.log("SUCCESS! All modal values match input data.");
      } else {
        try {
          // Wait for the modal content for 2 seconds
          // *we expect this element NOT to appear
          await driver.wait(
            until.elementLocated(By.className("modal-content")),
            2000
          );

          // If the execution reaches this line, it means the modal appeared,
          // which indicates the negative test case has failed
          throw new Error("FAIL! The form was submitted with incorrect data.");
        } catch (error) {
          if (error.name === "TimeoutError") {
            // A TimeoutError means the modal did not appear within 2 seconds
            console.log("SUCCESS! The form was not submitted.");
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.log(`Error in "${testCase.name}": `, error.message);
    } finally {
      await driver.quit();
    }
  }
}

runTests();

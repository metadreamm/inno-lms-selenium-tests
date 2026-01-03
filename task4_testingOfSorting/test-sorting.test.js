/*
1. Open https://www.saucedemo.com
2. Login as standard_user
3. Select sort by price (Low to high)
4. Make sure products are displayed correctly
*/

const { Builder, By, until } = require("selenium-webdriver");

async function testPriceSorting() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // 1. Open https://www.saucedemo.com
    await driver.get("https://www.saucedemo.com");

    // 2. Login as standard_user
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();

    await driver.sleep(2000); // demo

    // 3. Select sort by price (Low to high)
    await driver.findElement(By.className("product_sort_container")).click();
    // 'lohi' - Price (low to high)
    await driver.findElement(By.css('option[value="lohi"]')).click();

    await driver.sleep(2000); // demo

    // 4. Make sure products are displayed correctly

    // Capture all price elements
    const priceElements = await driver.findElements(
      By.className("inventory_item_price")
    );

    // Convert elements to an array of numbers
    const prices = [];
    for (let elem of priceElements) {
      const priceText = await elem.getText();
      const priceValue = parseFloat(priceText.replace("$", "")); // $7.99 -> 7.99
      prices.push(priceValue);
    }
    console.log("Captured prices:", prices);

    // Create a copy of the array and sort it numerically
    const sortedPrices = [...prices].sort((a, b) => a - b);

    // Compare original captured prices with sorted copy
    const isSortedCorrectly =
      JSON.stringify(prices) === JSON.stringify(sortedPrices);
    if (isSortedCorrectly) {
      console.log(
        "SUCCESS: Products are sorted correctly by price (Low to High)"
      );
    } else {
      throw new Error(`FAIL: Expected ${sortedPrices} but got ${prices}`);
    }
  } catch (error) {
    console.error("FAIL:", error.message);
  } finally {
    await driver.quit();
  }
}

testPriceSorting();

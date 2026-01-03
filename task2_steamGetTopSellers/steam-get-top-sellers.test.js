/*
1. Open the Steam homepage
2. Hover over "Store" in the page menu. Using explicit expectations, wait for the pop-up menu to appear and click on "Top Sellers"
(Charts -> Top Sellers)
3. Change the country to "Global".
4. Get the titles and price for the first 10 games
5. Click on the first result in the list
6. The page with the game is open, the price and title data match
7. Get the release date, developer and main genre of the game
*/

const { Builder, By, until } = require("selenium-webdriver");

async function testGetTopSellers() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // 1. Open the Steam home page
    await driver.get("https://store.steampowered.com/");

    // 2. Hover over "STORE" in the page menu
    const storeMenuItem = await driver.wait(
      until.elementLocated(By.css('[href*="store"]')),
      10000
    );
    const actions = driver.actions({ bridge: true });
    await actions.move({ origin: storeMenuItem }).perform();
  } finally {
    await driver.quit();
  }
}

testGetTopSellers();

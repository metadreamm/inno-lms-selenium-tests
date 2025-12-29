const { Builder, By, until } = require("selenium-webdriver");

async function testGetTopSellers() {
    const driver = await new Builder().forBrowser("chrome").build();

    try {
        // 1. Open the Steam home page
        await driver.get("https://store.steampowered.com/");

        // 2. Hover over "STORE" in the page menu
        const storeMenuItem = await driver.wait(until.elementLocated(By.css('[href*="store"]')), 10000);
        const actions = driver.actions({ bridge: true });
        await actions.move({ origin: storeMenuItem }).perform();
    } finally {
        await driver.quit();
    }
}

testGetTopSellers();
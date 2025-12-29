const { Builder, By, until } = require("selenium-webdriver");

function parseNumber(text) {
  // 123 456 / 123,456 / 123.456 -> 123456
  const digits = text.replace(/[^\d]/g, "");
  return Number(digits);
}

async function testSteamAbout() {
  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // 1. Open the Steam home page
    await driver.get("https://store.steampowered.com/");

    // 2. Click on the "About" button
    // The page may contain multiple /about links (a visible one and hidden duplicates
    // for responsive layout) — click the visible one.
    await driver.wait(until.elementLocated(By.css('a[href*="/about"]')), 10000);

    const links = await driver.findElements(By.css('a[href*="/about"]'));

    let clicked = false;
    for (const link of links) {
      if (await link.isDisplayed()) {
        await link.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) throw new Error("No visible About link found");

    // 3. Check to see if you've reached the page.
    await driver.wait(until.urlContains("/about"), 10000);
    console.log("Current URL:", await driver.getCurrentUrl());

    // 4. Compare the number of players. There are more players online than players in the game
    // ONLINE
    const onlineLabel = await driver.wait(
      until.elementLocated(
        By.css(".online_stats .online_stat_label.gamers_online")
      ),
      10000
    );

    // The numbers are stored in the parent .online_stat container, so we read text from the container
    const onlineContainer = await onlineLabel.findElement(By.xpath("..")); // parent .online_stat
    const online = parseNumber(await onlineContainer.getText());
    console.log(`Players online: ${online}`);

    // IN-GAME
    const inGameLabel = await driver.wait(
      until.elementLocated(
        By.css(".online_stats .online_stat_label.gamers_in_game")
      ),
      10000
    );

    const inGameContainer = await inGameLabel.findElement(By.xpath(".."));
    const inGame = parseNumber(await inGameContainer.getText());
    console.log(`Playing now: ${inGame}`);

    // ASSERT
    if (!(online > inGame)) {
      throw new Error(`Expected online > inGame, got online = ${online},
            inGame = ${inGame}`);
    } else {
      console.log(`${online} > ${inGame}`);
    }
  } finally {
    await driver.quit();
  }
}

testSteamAbout();

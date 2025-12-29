# inno-lms-selenium-tests

Selenium WebDriver practice repository: a set of small tasks and automated tests (educational / practice purpose only).

## Prerequisites
- Node.js + npm
- Google Chrome installed

## Repository layout
This repository is organized as a multi-package setup using npm workspaces.
Each task folder is an independent package with its own `package.json` (its own dependencies and scripts).

## Tasks

<details>
  <summary><b>task1_steamAbout</b> — Compare number of players</summary>

</details>

<details>
  <summary><b>task2_steamGetTopSellers</b> — Get Top Sellers</summary>

1. Open the [Steam homepage](https://store.steampowered.com/).
2. Hover over **Store**. Wait for the pop-up menu (explicit wait) and click **Top Sellers**.
3. Change the country to **Global**.
4. Collect title and price for the first 10 games.
5. Click the first result.
6. Verify the game page is opened and the title/price match the selected item.
7. Extract release date, developer, and main genre.

</details>


## Tech stack
- JavaScript (Node.js + npm)
- Selenium WebDriver (`selenium-webdriver`)
- ChromeDriver (`chromedriver` npm package)

## Setup
Install dependencies from the repository root: 
```bash
npm install
```

> Note: Avoid running `npm install` inside task folders to keep dependency management consistent.

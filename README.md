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
  
  1. Open the Steam home page
  2. Click on the "About" button
  3. Check to see if you've reached the page.
  4. Compare the number of players. There are more players online than players in the game
</details>

<details>
  <summary><b>task2_steamGetTopSellers</b> — Get Top Sellers (⚠️ In Progress)</summary>
  
  > **Note:** This task is currently under development
  
  1. Open the [Steam homepage](https://store.steampowered.com/).
  2. Hover over **Store**. Wait for the pop-up menu (explicit wait) and click **Top Sellers**.
  3. Change the country to **Global**.
  4. Collect title and price for the first 10 games.
  5. Click the first result.
  6. Verify the game page is opened and the title/price match the selected item.
  7. Extract release date, developer, and main genre.
</details>

<details>
  <summary><b>task3_sendingForm</b> — Sending form</summary>
  
  1. Go to the https://demoqa.com/automation-practice-form
  2. Fill all fields and attach some picture
  3. Click Submit button
  4. Make sure all the data that appears in the modal window is correct and matches what you entered
</details>

<details>
  <summary><b>task4_testingOfSorting</b> — Testing of sorting</summary>
  
  1. Open https://www.saucedemo.com
  2. Login as standard_user
  3. Select sort by price (Low to high)
  4. Make sure products are displayed correctly
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

## Usage
Since this is a multi-package repository using npm workspaces, you can run tests directly from the root directory using Node.js.

To run a specific test, use the following command format:
```bash
node ./<task_folder>/<filename>.js
```

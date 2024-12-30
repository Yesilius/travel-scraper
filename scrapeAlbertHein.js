import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { createCursor } from "ghost-cursor";
puppeteer.use(StealthPlugin());

const url =
  "https://www.sunweb.be/nl/vakantie/last-minutes?DepartureAirport%5B0%5D=BRU&Participants%5B0%5D%5B0%5D=1993-03-20&Participants%5B0%5D%5B1%5D=1993-03-20&ParticipantsDistribution=1%7C2&Lastminute=6weken&DepartureDate%5B0%5D=2024-12-27&DepartureDate%5B1%5D=2025-02-06&Mealplan%5B0%5D=AI&Duration%5B0%5D=8-11&TransportType=Flight&sort=Price&offset=0";
//Function

async function albert() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cursor = createCursor(page);
  // Navigate the page to a URL
  await page.goto(url);
  try {
    const cookieButton = await page.waitForSelector(
      "#CookieInfoDialogAcceptAll"
    );
    await cursor.click(cookieButton);
    console.log("Bypassing cookies...");
  } catch (error) {
    console.log(error);
  }

  try {
    console.log("Scraping data...");
    await page.waitForSelector(".c-search-result");
    const data = await page.evaluate(() => {
      const listData = Array.from(
        document.querySelectorAll(".c-search-result")
      );
      const items = listData.map((item) => ({
        title: item.querySelector(".c-search-result__body h2").innerText,
        price: item.querySelector(".m-price__value").innerText,
        image: item.querySelector(".c-img img").getAttribute("src"),
        link:
          "https://www.sunweb.be/" +
          item.querySelector(".c-search-result__link").getAttribute("href"),
        departureDate:
          item.querySelector(".c-package-block__arrival-date").innerText ||
          null,
        duration:
          item.querySelector(".c-package-block__filters li:first-child")
            .innerText || null,
      }));
      return items;
    });
    return data;
  } catch (error) {
    console.log(error);
  }
  await browser.close();
}

export default albert;

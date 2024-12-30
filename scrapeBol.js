import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { createCursor } from "ghost-cursor";

puppeteer.use(StealthPlugin());

const url =
  "https://www.vakantiediscounter.be/last-minute?room=2_0_0&special_deals=LastMinute&transporttype=VL&trip_duration_range=6-10";
//Function

async function bol() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cursor = createCursor(page);
  // Navigate the page to a URL
  await page.goto(url);
  console.log("Visiting page...");
  try {
    const cookieButton = await page.waitForSelector(
      "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
    );
    await cursor.click(cookieButton);
    console.log("Bypassing cookies...");
  } catch (error) {
    console.log(error);
  }

  try {
    await page.waitForSelector(".HolidayItem_container__cCq06");
    console.log("Scraping all data...");
    const allTravel = await page.evaluate(() => {
      const travelItems = Array.from(
        document.querySelectorAll(".HolidayItem_container__cCq06")
      );

      const data = travelItems.map((items) => ({
        title: items.querySelector(".AccoHeader_title__Q_Ndd h3").innerText,
        price: items.querySelector(".PerPersonPrice_perPerson__KYdqo ")
          .innerText,
        country: items.querySelector(".DestinationBreadcrumbs_list__b8kJC")
          .innerText,
        image:
          items.querySelector(".swiper-slide img").getAttribute("src") ||
          "NO image",
        link:
          "https://www.vakantiediscounter.be/" +
          items
            .querySelector(".AccoHeader_header__iGEDu a")
            .getAttribute("href"),
      }));
      console.log("Completed");
      return data;
    });
    return allTravel;
  } catch (error) {
    console.log(error);
  }
  await browser.close();
}

export default bol;

import albert from "./scrapeAlbertHein.js";
import bol from "./scrapeBol.js";

const data = await Promise.allSettled([albert(), bol()]);
console.log(...data);

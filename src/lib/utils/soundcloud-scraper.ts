import { text } from "svelte/internal";
import puppeteer from "puppeteer";
// export const puppeteer = require("puppeteer");

export async function getSoundCloudTags(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x(
    '//*[@id="content"]/div/div[2]/div/div[2]/div[3]/a/span'
  );
  const tag = await el.getProperty("text");
  //   await console.log("hello");
}

getSoundCloudTags("https://soundcloud.com/officialvenbee/messy-in-heaven");

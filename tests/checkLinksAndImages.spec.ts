import { test, expect } from "@playwright/test";
import { getMarketConfig } from "../config/markets";
import { HomePage } from "../pages/home-page";
import { ShopPage } from "../pages/shop-page";
import {
  confirmCookieAndAge,
  getMarketsToTest,
  openProductPageBySKU,
} from "./utils/test.utils";

test.describe("Add product to the Cart", () => {
  const markets = getMarketsToTest();

  markets.forEach((market) => {
    test(`Verify broken links for product page for ${market} market`, async ({
      page,
    }) => {
      const marketConfig = getMarketConfig(market);

      const homePage = new HomePage(page, market);
      const shopPage = new ShopPage(page, market);

      await page.goto(marketConfig.baseURL);

      await confirmCookieAndAge(page, homePage);

      await openProductPageBySKU(
        page,
        marketConfig,
        homePage,
        shopPage,
        marketConfig.sku_example
      );

      await page.waitForLoadState("domcontentloaded");

      const links = await page
        .locator("a")
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")).filter(Boolean)
        );

      const uniqueLinks = [...new Set(links)];

      const brokenLinks: string[] = [];
      const unsupportedLinks: string[] = [];
      const skippedLinks: string[] = [];
      const successfullyVerifiedLinks: string[] = [];

      for (const link of uniqueLinks) {
        if (!link) {
          console.warn("No links found on the page");
          continue;
        }

        if (link.startsWith("tel:") || link.startsWith("mailto:")) {
          console.warn(`Unsupported link: ${link}`);
          unsupportedLinks.push(link);
          continue;
        }

        if (link.startsWith("#")) {
          console.warn(`Skipping anchor link: ${link}`);
          skippedLinks.push(link);
          continue;
        }

        try {
          const url = link.startsWith("http")
            ? link
            : new URL(link, marketConfig.baseURL).toString();
          const response = await page.request.get(url);

          if (!response.ok()) {
            console.warn(
              `Broken link: ${url} with status: ${response.status()}`
            );
            brokenLinks.push(url);
          } else {
            successfullyVerifiedLinks.push(url);
          }
        } catch (error) {
          console.error(`Error checking link: ${link} - ${error}`);
          brokenLinks.push(link!);
        }
      }
      console.log("broken links: ", brokenLinks);
      console.log("unsupported links:", unsupportedLinks);
      console.log("skipped links:", skippedLinks);

      expect(brokenLinks).toHaveLength(0);
    });

    test(`Verify broken images on the product page for ${market}`, async ({
      page,
    }) => {
      const marketConfig = getMarketConfig(market);

      const homePage = new HomePage(page, market);
      const shopPage = new ShopPage(page, market);

      await page.goto(marketConfig.baseURL);

      await confirmCookieAndAge(page, homePage);

      await openProductPageBySKU(
        page,
        marketConfig,
        homePage,
        shopPage,
        marketConfig.sku_example
      );

      await page.waitForLoadState("domcontentloaded");
      const images = page.locator("img");
      const imageSrcs = await images.evaluateAll((images) =>
        images.map((img) => (img as HTMLImageElement).src)
      );

      if (imageSrcs.length === 0) {
        console.warn("No images found on the page");
        return;
      }

      for (const src of imageSrcs) {
        const response = await page.request.get(src);
        expect.soft(response.status()).toBe(200);
      }
    });
  });
});

import { test, expect, Page } from "@playwright/test";
import { getMarketConfig, isValidMarket, Market } from "../config/markets";
import { HomePage } from "../pages/home-page";
import { ShopPage } from "../pages/shop-page";
import { confirmCookieAndAge, openProductPageBySKU } from "./utils/test.utils";

test.describe("Add product to the Cart", () => {
  const marketFromEnv = process.env.MARKET?.toUpperCase();

  const markets: Market[] = isValidMarket(marketFromEnv)
    ? [marketFromEnv]
    : ["PL", "UK"];

  if (marketFromEnv && !isValidMarket(marketFromEnv)) {
    console.warn(
      `Warning: Invalid market "${marketFromEnv}". Default testing for all allowed markets: "${markets}".`
    );
  }

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

      console.log(uniqueLinks);
      const brokenLinks: string[] = [];
      const unsupportedLinks: string[] = [];
      const skippedLinks: string[] = [];
      const successfullyVerifiedLinks: string[] = [];

      if (uniqueLinks.length === 0) {
        console.warn("No links found on the page");
        return;
      }

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
      console.log("successfully verified links:", successfullyVerifiedLinks);

      expect(brokenLinks).toHaveLength(0);
    });
  });
});

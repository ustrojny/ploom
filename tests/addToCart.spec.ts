import { test, expect } from "@playwright/test";
import { getMarketConfig, isValidMarket, Market } from "../config/markets";
import { HomePage } from "../pages/home-page";
import { ShopPage } from "../pages/shop-page";
import { ProductPage } from "../pages/product-page";

test.describe("Add to Cart", () => {
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
    test(`Verify add to cart for ${market} market`, async ({ page }) => {
      const marketConfig = getMarketConfig(market);

      const homePage = new HomePage(page, market);
      const shopPage = new ShopPage(page, market);
      const productPage = new ProductPage(page, market);

      await page.goto(marketConfig.baseURL);

      await homePage.acceptCookies();
      await homePage.confirmAge();

      await homePage.navigateToShop();
      await page.waitForURL(marketConfig.shopURL);
      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("domcontentloaded");

      await shopPage.openProductBySKU(marketConfig.sku_example);
      expect(productPage.addToCartButton).toBeVisible();
      await productPage.clickAddToCartButton();
      await page.waitForLoadState("networkidle");
      expect(productPage.cartButton).toBeVisible();
    });
  });
});

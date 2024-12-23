import { test, expect } from "@playwright/test";
import { getMarketConfig } from "../config/markets";
import { HomePage } from "../pages/HomePage";
import { ShopPage } from "../pages/ShopPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import {
  addProductToCart,
  confirmCookieAndAge,
  getMarketsToTest,
} from "./utils/test.utils";

test.describe("Add product to the Cart", () => {
  const markets = getMarketsToTest();

  markets.forEach((market) => {
    test(`Verify add to cart for ${market} market`, async ({ page }) => {
      test.setTimeout(60000);
      const marketConfig = getMarketConfig(market);

      const homePage = new HomePage(page, market);
      const shopPage = new ShopPage(page, market);
      const productPage = new ProductPage(page, market);
      const cartPage = new CartPage(page, market);

      await page.goto(marketConfig.baseURL);

      await confirmCookieAndAge(page, homePage);

      await addProductToCart(
        page,
        marketConfig,
        homePage,
        shopPage,
        productPage,
        marketConfig.sku_example
      );

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(5000);

      const itemsCount = await productPage.checkCartItems();
      expect(itemsCount).toBe("1");

      await page.waitForTimeout(5000);
      await productPage.openCheckout();
      await page.waitForURL(marketConfig.checkoutURL);
      await page.waitForLoadState("domcontentloaded");

      expect(cartPage.cartHeader).toBeVisible();
      await page.waitForTimeout(6000);
      const cartInputValue = await cartPage.checkItemsInput();
      expect(cartInputValue).toBe("1");
      expect(cartPage.removeButton).toBeVisible();
      expect(cartPage.productName).toBeVisible();
    });
  });
});

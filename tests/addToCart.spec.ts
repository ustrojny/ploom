import { test, expect } from "@playwright/test";
import { getMarketConfig } from "../config/markets";
import { HomePage } from "../pages/home-page";
import { ShopPage } from "../pages/shop-page";
import { ProductPage } from "../pages/product-page";
import { CartPage } from "../pages/cart-page";
import {
  addProductToCart,
  confirmCookieAndAge,
  getMarketsToTest,
} from "./utils/test.utils";

test.describe("Add product to the Cart", () => {
  const markets = getMarketsToTest();

  markets.forEach((market) => {
    test(`Verify add to cart for ${market} market`, async ({ page }) => {
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

      const itemsCount = await productPage.checkCartItems();
      expect(itemsCount).toBe("1");

      await productPage.openCheckout();
      await page.waitForURL(marketConfig.checkoutURL);
      await page.waitForTimeout(5000);

      expect(cartPage.cartHeader).toBeVisible();
      const cartInputValue = await cartPage.checkItemsInput();
      expect(cartInputValue).toBe("1");
      expect(cartPage.removeButton).toBeVisible();
      expect(cartPage.productName).toBeVisible();
    });
  });
});

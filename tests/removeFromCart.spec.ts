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

test.describe("Remove product from the Cart", () => {
  const markets = getMarketsToTest();

  markets.forEach((market) => {
    test(`Verify remove the only product from the cart for ${market} market`, async ({
      page,
    }) => {
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
      await productPage.openCheckout();
      await page.waitForURL(marketConfig.checkoutURL);
      await page.waitForTimeout(6000);

      const cartInputValue = await cartPage.checkItemsInput();
      expect(cartInputValue).toBe("1");

      expect(cartPage.removeButton).toBeVisible();
      await cartPage.removeProduct();
      expect(cartPage.removeModalTitle).toBeVisible();
      await cartPage.confirmRemoveButton.click();
      await page.waitForTimeout(3000);
      expect(cartPage.emptyCartMessage).toBeVisible();
    });

    // Additional test cases which might be added:
    // Verify remove multiple units of the same product from the cart - very similar to implemented scenario
    // Verify remove 1 of 2 different products from the cart
  });
});

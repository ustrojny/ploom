import { test, expect, Page } from "@playwright/test";
import { getMarketConfig, isValidMarket, Market } from "../config/markets";
import { HomePage } from "../pages/home-page";
import { ShopPage } from "../pages/shop-page";
import { ProductPage } from "../pages/product-page";
import { CartPage } from "../pages/cart-page";

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
        cartPage
      );
    });
  });
});

export async function confirmCookieAndAge(page: Page, homePage: HomePage) {
  await homePage.acceptCookies();
  await homePage.confirmAge();
}

export async function addProductToCart(
  page: Page,
  marketConfig,
  homePage: HomePage,
  shopPage: ShopPage,
  productPage: ProductPage,
  cartPage: CartPage
) {
  await homePage.navigateToShop();
  await page.waitForURL(marketConfig.shopURL);
  await page.waitForLoadState("domcontentloaded");

  await shopPage.openProductBySKU(marketConfig.sku_example);

  expect(productPage.addToCartButton).toBeVisible();
  await page.waitForTimeout(5000);
  await productPage.clickAddToCartButton();

  await page.waitForLoadState("domcontentloaded");
  let itemsCount = await productPage.checkCartItems();
  expect(itemsCount).toBe("1");

  await productPage.openCheckout();
  await page.waitForURL(marketConfig.checkoutURL);

  expect(cartPage.cartHeader).toBeVisible();
  const cartInputValue = await cartPage.checkItemsInput();
  expect(cartInputValue).toBe("1");
  expect(cartPage.removeButton).toBeVisible();
  expect(cartPage.productName).toBeVisible();
}

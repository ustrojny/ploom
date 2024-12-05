import { expect, Page } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { ShopPage } from "../../pages/ShopPage";
import { ProductPage } from "../../pages/ProductPage";
import { isValidMarket, Market } from "../../config/markets";

export async function confirmCookieAndAge(page: Page, homePage: HomePage) {
  await homePage.acceptCookies();
  await homePage.confirmAge();
}

export async function openProductPageBySKU(
  page: Page,
  marketConfig,
  homePage: HomePage,
  shopPage: ShopPage,
  sku: string
) {
  await homePage.navigateToShop();
  await page.waitForURL(marketConfig.shopURL);
  await page.waitForLoadState("domcontentloaded");

  await shopPage.openProductBySKU(sku);
}

export async function addProductToCart(
  page: Page,
  marketConfig,
  homePage: HomePage,
  shopPage: ShopPage,
  productPage: ProductPage,
  sku: string
) {
  await openProductPageBySKU(page, marketConfig, homePage, shopPage, sku);

  expect(productPage.addToCartButton).toBeVisible();
  await page.waitForTimeout(5000);
  await productPage.clickAddToCartButton();
}

export function getMarketsToTest(): Market[] {
  const marketFromEnv = process.env.MARKET?.toUpperCase();
  const defaultMarket: Market = "UK";

  const markets: Market[] = isValidMarket(marketFromEnv)
    ? [marketFromEnv]
    : [defaultMarket];

  if (marketFromEnv && !isValidMarket(marketFromEnv)) {
    console.warn(
      `Warning: Invalid market "${marketFromEnv}". Default testing for market: "${defaultMarket}".`
    );
  }
  return markets;
}

import { expect, Page } from "@playwright/test";
import { HomePage } from "../../pages/home-page";
import { ShopPage } from "../../pages/shop-page";
import { ProductPage } from "../../pages/product-page";

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
  sku: string
) {
  await openProductPageBySKU(page, marketConfig, homePage, shopPage, sku);

  expect(productPage.addToCartButton).toBeVisible();
  await page.waitForTimeout(5000);
  await productPage.clickAddToCartButton();
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
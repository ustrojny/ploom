import { Locator, Page } from "@playwright/test";
import { getLocalization, localization } from "../config/localization";

export class BasePage {
  readonly page: Page;
  readonly localization;
  readonly shopLink: Locator;
  readonly cartButton: Locator;
  //   readonly cartHeader: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page, market: keyof typeof localization) {
    this.page = page;
    this.localization = getLocalization(market);
    // I can use this.page.locator('[data-testid="header"]' but I prefer to use semantic meaningful locators
    this.shopLink = this.page.getByRole("navigation").getByRole("link", {
      name: this.localization.shopLinkText,
      exact: true,
    });
    this.cartButton = this.page.getByTestId("miniCart");
    // this.cartHeader = this.page.getByTestId("mini-cart-header");
    this.checkoutButton = this.page.getByRole("button", {
      name: this.localization.checkoutButton,
    });
  }

  public async navigateToShop() {
    await this.shopLink.click({ force: true });
  }

  public async openCart() {
    await this.cartButton.click();
  }

  public async checkCartItems() {
    const cartItems = this.page.locator(".IconLabeled-module-label-fmiDL");
    const itemsCount = await cartItems.textContent();
    return itemsCount;
  }

  public async openCheckout() {
    await this.checkoutButton.click();
  }
}

import { Locator, Page } from "@playwright/test";
import { getLocalization, localization } from "../config/localization";

export class BasePage {
  readonly page: Page;
  readonly localization;
  readonly shopLink: Locator;
  readonly cartButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page, market: keyof typeof localization) {
    this.page = page;
    this.localization = getLocalization(market);
    // I can use this.page.locator('[data-testid="header"]' but I prefer to use semantic meaningful locators
    this.shopLink = this.page.getByRole("navigation").getByRole("link", {
      name: this.localization.shopLinkText,
      exact: true,
    });
    this.cartButton = this.page.getByTestId("miniCart");

    const cartItems = this.page.locator(".mini-cart__icon-label");
  }

  public async navigateToShop() {
    await this.shopLink.click();
  }

  public async openCart() {
    await this.cartButton.click();
  }
}

import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Market } from "../config/markets";

export class ProductPage extends BasePage {
  readonly addToCartButton: Locator;

  constructor(page: Page, market: Market) {
    super(page, market);
    this.addToCartButton = this.page.getByRole("button", {
      name: this.localization.addToCartButton,
    });
  }

  public async clickAddToCartButton() {
    await this.addToCartButton.click();
  }
}

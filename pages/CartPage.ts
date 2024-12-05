import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Market } from "../config/markets";

export class CartPage extends BasePage {
  readonly cartHeader: Locator;
  readonly itemsInput: Locator;
  readonly removeButton: Locator;
  readonly productName: Locator;
  readonly removeModalTitle: Locator;
  readonly confirmRemoveButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly addOneMoreButton: Locator;

  constructor(page: Page, market: Market) {
    super(page, market);
    // I wanted to use getByRole locator for header, but on PL website it is not a header, but span
    this.cartHeader = this.page.getByTestId("page-layout-title");
    this.itemsInput = this.page
      .getByTestId("regular-cart-list")
      .getByTestId("cartQuantity");
    this.removeButton = this.page.getByRole("button", {
      name: this.localization.removeProduct,
    });
    this.productName = this.page
      .getByTestId("regular-cart-list")
      .getByText(this.localization.productName, { exact: false });

    this.removeModalTitle = this.page.getByText(
      this.localization.removeProductModalTitle
    );
    this.confirmRemoveButton = this.page.getByRole("button", {
      name: this.localization.confirmRemoveButton,
    });
    this.emptyCartMessage = this.page.getByText(
      this.localization.emptyCartMessage
    );
  }

  public async checkItemsInput() {
    const timeout = 10000;
    const interval = 100;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        if (await this.itemsInput.isVisible()) {
          const itemsCount = await this.itemsInput.inputValue();
          return itemsCount;
        }
      } catch (error) {}
      await this.page.waitForTimeout(interval);
    }

    throw new Error(
      `Cart is still loading, items input was not found in ${timeout}ms.`
    );
  }

  public async removeProduct() {
    await this.removeButton.first().click();
  }
}

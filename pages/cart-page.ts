import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";
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
    return this.itemsInput.inputValue();
  }

  public async removeProduct() {
    await this.removeButton.first().click();
  }
}

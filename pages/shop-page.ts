import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { Market } from "../config/markets";

export class ShopPage extends BasePage {
  readonly seeAllProducts: Locator;
  readonly allSKUs: Locator;

  constructor(page: Page, market: Market) {
    super(page, market);
    this.seeAllProducts = this.page.getByText(this.localization.seeAllProducts);
    this.allSKUs = this.page.locator("[data-testid='all_skus']");
  }

  public async openProductBySKU(productSKU: string) {
    await this.seeAllProducts.first().click({ force: true });
    await this.allSKUs.waitFor({ state: "visible" });

    const productLink = this.page.locator(`[data-sku="${productSKU}"]`);
    await productLink.click({ force: true });
  }
}

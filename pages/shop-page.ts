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

  // iterative approach with controlled timeout due to problems with default waitFor elements and content loading
  public async openProductBySKU(productSKU: string) {
    await this.seeAllProducts.first().click({ force: true });
    await this.allSKUs.waitFor({ state: "visible" });

    const productLinkSelector = `[data-sku="${productSKU}"]`;
    const timeout = 8000;
    const interval = 100;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const productLink = this.page.locator(productLinkSelector);
        if (await productLink.isVisible()) {
          await productLink.click({ force: true });
          return;
        }
      } catch (error) {}
      await this.page.waitForTimeout(interval);
    }

    throw new Error(
      `Element with SKU "${productSKU}" was not found in ${timeout}ms.`
    );
  }
}

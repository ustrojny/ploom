import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Market } from "../config/markets";

export class HomePage extends BasePage {
  readonly cookieConfirmButton: Locator;
  readonly cookieBanner: Locator;
  readonly ageConfirmButton: Locator;

  constructor(page: Page, market: Market) {
    super(page, market);
    this.cookieConfirmButton = this.page.getByText(
      this.localization.cookiesConsent
    );
    this.cookieBanner = this.page.locator("#onetrust-banner-sdk");
    this.ageConfirmButton = this.page.getByText(
      this.localization.ageConfirmation
    );
  }

  public async acceptCookies() {
    if (await this.cookieBanner.isVisible()) {
      await this.cookieConfirmButton.click();
    }
  }

  public async confirmAge() {
    await this.ageConfirmButton.click();
  }
}

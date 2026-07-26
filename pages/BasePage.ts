import { Page, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  protected get message() {
    return this.page.locator("#mensagem");
  }

  async expectErrorMessage(message: string) {
    await expect(this.message).toContainText(message);
  }
}

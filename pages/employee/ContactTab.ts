import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class ContactTab {
  constructor(private page: Page) {}

  private get phone() {
    return this.page.locator("#input-telefone");
  }

  async fill(employee: Employee) {
    await this.phone.fill(employee.telefone);
  }
}

import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class ObservationsTab {
  constructor(private page: Page) {}

  private get observations() {
    return this.page.locator("#input-observacoes");
  }

  async fill(employee: Employee) {
    await this.observations.fill(employee.observacoes);
  }
}

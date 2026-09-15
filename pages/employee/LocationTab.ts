import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class LocationTab {
  constructor(private page: Page) {}

  private get city() {
    return this.page.locator("#input-cidade");
  }
  private get state() {
    return this.page.locator("#input-uf");
  }
  private get country() {
    return this.page.locator("#input-pais");
  }

  async fill(employee: Employee) {
    await this.city.fill(employee.cidade);
    await this.state.fill(employee.uf);
    await this.country.fill(employee.pais);
  }
}

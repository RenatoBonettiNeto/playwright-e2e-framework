import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class InternalMobilityTab {
  constructor(private page: Page) {}

  private get areasOfInterest() {
    return this.page.locator("#input-areas-interesse");
  }
  private get mobilityIntention() {
    return this.page.locator("#input-pretensao");
  }

  async fill(employee: Employee) {
    await this.areasOfInterest.fill(employee.areasInteresse);
    await this.mobilityIntention.fill(employee.pretensaoMovimentacao);
  }
}

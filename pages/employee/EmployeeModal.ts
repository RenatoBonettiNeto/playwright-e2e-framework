import { Page } from "@playwright/test";

export class EmployeeModal {
  constructor(private page: Page) {}

  async goToOrganizationTab() {
    await this.page
      .getByRole("button", {
        name: "Vínculo Organizacional",
      })
      .click();
  }

  async clickSave() {
    await this.page
      .getByRole("button", {
        name: "Salvar",
      })
      .click();
  }
}

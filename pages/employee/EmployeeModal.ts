import { Page } from "@playwright/test";

export class EmployeeModal {
  constructor(private page: Page) {}

  async goToPersonalDataTab() {
    await this.page.getByRole("button", { name: "Dados Pessoais", exact: true }).click();
  }

  async goToOrganizationTab() {
    await this.page
      .getByRole("button", {
        name: "Vínculo Organizacional",
      })
      .click();
  }

  async goToWorkTab() {
    await this.page.getByRole("button", { name: "Trabalho", exact: true }).click();
  }

  async goToInternalMobilityTab() {
    await this.page.getByRole("button", { name: "Mobilidade Interna", exact: true }).click();
  }

  async goToContactTab() {
    await this.page.getByRole("button", { name: "Contato", exact: true }).click();
  }

  async goToLocationTab() {
    await this.page.getByRole("button", { name: "Localização", exact: true }).click();
  }

  async goToObservationsTab() {
    await this.page.getByRole("button", { name: "Observações", exact: true }).click();
  }

  async clickSave() {
    await this.page
      .getByRole("button", {
        name: "Salvar",
      })
      .click();
  }
}

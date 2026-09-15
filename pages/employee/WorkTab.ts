import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class WorkTab {
  constructor(private page: Page) {}

  private get admissionDate() {
    return this.page.locator("#input-data-admissao");
  }
  private get workModel() {
    return this.page.locator("#select-modelo-trabalho");
  }
  private get workingHours() {
    return this.page.locator("#input-jornada");
  }
  private get careerLevel() {
    return this.page.locator("#input-nivel-carreira");
  }

  async fill(employee: Employee) {
    await this.admissionDate.fill(employee.dataAdmissao);
    await this.workModel.selectOption(employee.modeloTrabalho);
    await this.workingHours.fill(employee.jornada);
    await this.careerLevel.fill(employee.nivelCarreira);
  }
}

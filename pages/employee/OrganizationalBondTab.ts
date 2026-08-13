import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class OrganizationalBondTab {
  constructor(private page: Page) {}

  private get corporateEmail() {
    return this.page.locator("#input-email-corporativo");
  }
  private get personalEmail() {
    return this.page.locator("#input-email-pessoal");
  }
  private get department() {
    return this.page.locator("#select-departamento");
  }
 async selectDepartment(departmentId: number) {
  await this.department.selectOption(String(departmentId));
}
  private get role() {
    return this.page.locator("#select-cargo");
  }
  async selectRole(roleId: number) {
    await this.role.selectOption(String(roleId));
  }
  private get status() {
    return this.page.locator("#select-status");
  }
  async selecionarStatus(status: string) {
    await this.status.selectOption(status);
  }

  async fill(employee: Employee) {
    await this.corporateEmail.fill(employee.emailCorporativo);
    await this.personalEmail.fill(employee.emailPessoal);

    await this.selectDepartment(employee.departamentoId);
    await this.selectRole(employee.cargoId);

    await this.selecionarStatus(employee.status);
  }
}

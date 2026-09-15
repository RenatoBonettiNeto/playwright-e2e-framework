import { Page } from "@playwright/test";
import { Employee } from "../../fixtures/employee";

export class PersonalDataTab {
  constructor(private page: Page) {}

  private get fullName() {
    return this.page.locator("#input-nome-completo");
  }
  private get cpf() {
    return this.page.locator("#input-cpf");
  }
  private get dateOfBirth() {
    return this.page.locator("#input-data-nascimento");
  }
  async preencherDataNascimento(data: string) {
    await this.dateOfBirth.fill(data);
  }
  private get gender() {
    return this.page.locator("#input-genero");
  }

  async fill(employee: Employee) {
    await this.fullName.fill(employee.nomeCompleto);
    await this.cpf.fill(employee.cpf);
    await this.preencherDataNascimento(employee.dataNascimento);
    await this.gender.fill(employee.genero);
  }
}

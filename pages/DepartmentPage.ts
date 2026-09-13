import { Page, expect } from "@playwright/test";
import { Department } from "../fixtures/department";
import { BasePage } from "./BasePage";

export class DepartmentPage extends BasePage {
  async open() {
    await this.page.goto("departments.html");
  }

  async clickButtonNewDepartment() {
    await this.page
      .getByRole("button", {
        name: "Novo departamento",
      })
      .click();
  }

  async fillName(name: string) {
    await this.page.getByRole("textbox", { name: "Nome *" }).fill(name);
  }
  async fillSigla(sigla: string) {
    await this.page.getByRole("textbox", { name: "Sigla" }).fill(sigla);
  }
  async departmentParent(parent: string) {
    await this.page.getByLabel("Departamento pai").selectOption(parent);
  }
  async fillSectoralEmail(email: string) {
    await this.page
      .getByRole("textbox", { name: "E-mail setorial" })
      .fill(email);
  }
  async fillLocation(location: string) {
    await this.page
      .getByRole("textbox", { name: "Localização" })
      .fill(location);
  }
  async fillMission(mission: string) {
    await this.page.getByRole("textbox", { name: "Missão" }).fill(mission);
  }
  async fillObjectives(objectives: string) {
    await this.page
      .getByRole("textbox", { name: "Objetivos" })
      .fill(objectives);
  }

  async clickSave() {
    await this.page
      .getByRole("button", {
        name: "Salvar",
      })
      .click();
  }

  async create(department: Department) {
    await this.open();
    await this.clickButtonNewDepartment();
    await this.fillName(department.name);
    await this.fillSigla(department.sigla);
    await this.departmentParent(department.departamento_pai);
    await this.fillSectoralEmail(department.email_setorial);
    await this.fillLocation(department.localizacao);
    await this.fillMission(department.missao);
    await this.fillObjectives(department.objetivos);
    await this.clickSave();
  }
}

import { BasePage } from "./BasePage";
import { Role } from "../fixtures/role";

export class RolePage extends BasePage {
  async open() {
    await this.page.goto("roles.html");
  }

  async clickButtonNewRole() {
    await this.page
      .getByRole("button", {
        name: "Novo cargo",
      })
      .click();
  }

  async fillName(name: string) {
    await this.page.getByRole("textbox", { name: "Nome *" }).fill(name);
  }

  async fillDescription(description: string) {
    await this.page.getByRole("textbox", { name: "Descrição" }).fill(description);
  }

  async selectDepartment(departmentId: number) {
    await this.page.locator("#select-departamento").selectOption(String(departmentId));
  }

  async selectWorkModel(workModel: string) {
    await this.page.locator("#select-modelo").selectOption(workModel);
  }

  async fillWorkSchedule(workSchedule: string) {
    await this.page.getByRole("textbox", { name: "Jornada" }).fill(workSchedule);
  }

  async selectContractType(contractType: string) {
    await this.page.getByLabel("Regime contratual").selectOption(contractType);
  }

  async selectMinimumEducation(minimumEducation: string) {
    await this.page.getByLabel("Escolaridade mínima").selectOption(minimumEducation);
  }

  async fillExperienceMonths(months: number) {
    await this.page
      .getByRole("spinbutton", { name: "Tempo de experiência (meses)" })
      .fill(String(months));
  }

  async fillMinimumRequirements(requirements: string) {
    await this.page.getByRole("textbox", { name: "Requisitos mínimos" }).fill(requirements);
  }

  async fillDesiredRequirements(requirements: string) {
    await this.page.getByRole("textbox", { name: "Requisitos desejáveis" }).fill(requirements);
  }

  async fillObjectives(objectives: string) {
    await this.page.getByRole("textbox", { name: "Objetivos" }).fill(objectives);
  }

  async clickSave() {
    await this.page
      .getByRole("button", {
        name: "Salvar",
      })
      .click();
  }

  async create(role: Role) {
    await this.open();
    await this.clickButtonNewRole();
    await this.fillName(role.nome);
    await this.fillDescription(role.descricao);
    await this.selectDepartment(role.departamento_id);
    if (role.modelo_trabalho !== undefined) {
      await this.selectWorkModel(role.modelo_trabalho);
    }
    await this.fillWorkSchedule(role.jornada);
    if (role.regime_contratual !== undefined) {
      await this.selectContractType(role.regime_contratual);
    }
    if (role.escolaridade_minima !== undefined) {
      await this.selectMinimumEducation(role.escolaridade_minima);
    }
    if (role.tempo_experiencia_meses !== undefined) {
      await this.fillExperienceMonths(role.tempo_experiencia_meses);
    }
    await this.fillMinimumRequirements(role.requisitos_minimos);
    await this.fillDesiredRequirements(role.requisitos_desejaveis);
    await this.fillObjectives(role.objetivos);
    await this.clickSave();
  }
}

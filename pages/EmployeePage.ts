import { BasePage } from "./BasePage";

export class EmployeePage extends BasePage {
  async acessar() {
    await this.page.goto("employees.html");
  }

  async clicarBotaoNovoFuncionario() {
    await this.page.getByRole("button", {
      name: "Novo funcionário",
    });
  }

  async ClicarBotaoSalvar() {
    await this.page
      .getByRole("button", {
        name: "Salvar",
      })
      .click();
  }
}

import { Page, expect } from "@playwright/test";
import { User, UserType } from "../fixtures/user";

export class LoginPage {
  constructor(private page: Page) {}

  private roleButton = (role: UserType) =>
    this.page.locator(`[data-role="${role}"]`);

  async acessar() {
    await this.page.goto("login.html");
  }

  async selecionarTipoUsuario(tipo: UserType) {
    await this.roleButton(tipo).click();
  }

  async preencherUsuario(usuario: string) {
    await this.page.getByPlaceholder("E-mail ou Usuário:").fill(usuario);
  }

  async preencherSenha(senha: string) {
    await this.page.getByPlaceholder("Senha").fill(senha);
  }

  async clicarBotaoRealizarLogin() {
    await this.page.getByRole("button", { name: "Realizar Login!" }).click();
  }

   async validarRedirecionamentoHomePage() {
    await expect(this.page).toHaveURL(/homepage.html/);
  }

    async login(user: User) {
    await this.acessar();
    await this.selecionarTipoUsuario(user.type);
    await this.preencherUsuario(user.name);
    await this.preencherSenha(user.password);
    await this.clicarBotaoRealizarLogin();
    await this.validarRedirecionamentoHomePage();
  }

}

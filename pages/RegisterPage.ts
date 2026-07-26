import { Page, expect } from "@playwright/test";
import { User, UserType } from "../fixtures/user";
import { BasePage } from "./BasePage";

export class RegisterPage extends BasePage {
  private roleButton = (role: UserType) =>
    this.page.locator(`[data-role="${role}"]`);

  async acessar() {
    await this.page.goto("register.html");
  }

  async selecionarTipoUsuario(tipo: UserType) {
    await this.roleButton(tipo).click();
  }

  async preencherNomeUsuario(usuario: string) {
    await this.page.getByPlaceholder("Nome do Usuário:").fill(usuario);
  }
  async preencherEmail(email: string) {
    await this.page.getByPlaceholder("E-mail:").fill(email);
  }

  async preencherSenha(senha: string) {
    await this.page.locator('input[name="password"]').fill(senha);
  }

  async preencherConfirmarSenha(confirmarSenha: string) {
    await this.page
      .locator('input[name="confirm-password"]')
      .fill(confirmarSenha);
  }

  async clicarBotaoRegistrar() {
    await this.page.getByRole("button", { name: "Registrar-se" }).click();
  }
  async register(user: User) {
    await this.acessar();
    await this.selecionarTipoUsuario(user.type);
    await this.preencherNomeUsuario(user.name);
    await this.preencherEmail(user.email);
    await this.preencherSenha(user.password);
    await this.preencherConfirmarSenha(user.confirmPassword);
    await this.clicarBotaoRegistrar();
  }

  async expectStayOnRegisterPage() {
    await expect(this.page).toHaveURL(/register.html/);
  }
}

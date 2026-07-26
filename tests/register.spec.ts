import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import {
  createCollaborator,
  createUserWithInvalidEmail,
  createUserWithShortPassword,
  createRecruiter,
  createUserWithDifferentPasswords,
  createUserWithoutName,
  createUserWithoutEmail,
  createUserWithoutPassword,
  createUserWithoutConfirmPassword,
} from "../fixtures/user";
import { UserApi } from "../helpers/api/userApi";

test.describe("Happy Path", () => {
  test("Deve cadastrar um recrutador com sucesso", async ({
    page,
    request,
  }) => {
    const recruiter = createRecruiter();
    const registerPage = new RegisterPage(page);
    await registerPage.register(recruiter);
    await expect(page).toHaveURL(/login.html/);
  });

  test("Deve cadastrar um colaborador com sucesso", async ({ page }) => {
    const collaborator = createCollaborator();
    const registerPage = new RegisterPage(page);
    await registerPage.register(collaborator);
    await expect(page).toHaveURL(/login.html/);
  });
});

test.describe("Validation", () => {
  test("Não deve permitir registrar usuário com e-mail inválido.", async ({
    page,
  }) => {
    const user = createUserWithInvalidEmail();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage("E-mail invalido!");
    await registerPage.expectStayOnRegisterPage();
  });

  test("Não deve permitir registrar usuário cuja senha indicada tenha menos de 8 caracteres.", async ({
    page,
  }) => {
    const user = createUserWithShortPassword();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage(
      "A senha deve ter pelo menos 8 caracteres!",
    );
    await registerPage.expectStayOnRegisterPage();
  });

  test("Não deve permitir registrar usuário cujas senhas não correspondem.", async ({
    page,
  }) => {
    const user = createUserWithDifferentPasswords();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage("As senhas não coincidem!");
    await registerPage.expectStayOnRegisterPage();
  });

  test("Não deve permitir criar um usuário sem nome", async ({ page }) => {
    const user = createUserWithoutName();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage("Nome de usuário é obrigatório!");
    await registerPage.expectStayOnRegisterPage();
  });

  test("Não deve permitir criar um usuário sem email", async ({ page }) => {
    const user = createUserWithoutEmail();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage("Email é obrigatório!");
    await registerPage.expectStayOnRegisterPage();
  });

  test("Não deve permitir criar um usuário sem senha", async ({ page }) => {
    const user = createUserWithoutPassword();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage("Senha é obrigatório!");
    await registerPage.expectStayOnRegisterPage();
  });

  test("Não deve permitir criar um usuário sem confirmação de senha", async ({
    page,
  }) => {
    const user = createUserWithoutConfirmPassword();
    const registerPage = new RegisterPage(page);
    await registerPage.register(user);
    await registerPage.expectErrorMessage(
      "Confirmação da senha é obrigatória!",
    );
    await registerPage.expectStayOnRegisterPage();
  });
});

test.describe("Business Rules", () => {
  test("Não deve permitir registrar novo usuário com e-mail já cadastrado.", async ({
    page,
    request,
  }) => {
    const user = createRecruiter();
    const registerPage = new RegisterPage(page);
    await UserApi.create(request, user);
    await registerPage.register(user);
    await registerPage.expectErrorMessage(
      "Nome de usuario ou e-mail ja cadastrado.",
    );
    await registerPage.expectStayOnRegisterPage();
  });
});

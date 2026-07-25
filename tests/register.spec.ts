import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import {
  createCollaborator,
  createInvalidEmailUser,
  createInvalidPasswordUser,
  createRecruiter,
  createInvalidDoNotCorrespondPasswordUser,
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
    const user = createInvalidEmailUser();

    const registerPage = new RegisterPage(page);

    await registerPage.register(user);

    await expect(page.locator("#mensagem")).toContainText("E-mail invalido!");
    await expect(page).toHaveURL(/register.html/);
  });

  test("Não deve permitir registrar usuário cuja senha indicada tenha menos de 8 caracteres.", async ({
    page,
  }) => {
    const user = createInvalidPasswordUser();

    const registerPage = new RegisterPage(page);

    await registerPage.register(user);

    await expect(page.locator("#mensagem")).toContainText(
      "A senha deve ter pelo menos 8 caracteres!",
    );

    await expect(page).toHaveURL(/register.html/);
  });

  test("Não deve permitir registrar usuário cujas senhas não correspondem.", async ({
    page,
  }) => {
    const user = createInvalidDoNotCorrespondPasswordUser();

    const registerPage = new RegisterPage(page);

    await registerPage.register(user);

    await expect(page.locator("#mensagem")).toContainText(
      "As senhas não coincidem!",
    );

    await expect(page).toHaveURL(/register.html/);
  });
});

test.describe("Business Rules", () => {
  
});

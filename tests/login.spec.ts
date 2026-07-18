import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { validCollaborator, validRecruiter } from "../fixtures/user";

test.describe("Login Recruiter", () => {
  test("Deve permitir que o recrutador faça login com sucesso", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(validRecruiter);

    await expect(page).toHaveURL(/homepage.html/);
  });
});

test.describe("Login Collaborator", () => {
  test("Deve impedir login do colaborador sem liberação", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(validCollaborator);

    await loginPage.validarMensagemAguardandoLiberacao();
  });
});
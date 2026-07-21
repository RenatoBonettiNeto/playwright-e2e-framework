import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { createCollaborator, createRecruiter } from "../fixtures/user";
import { UserApi } from "../helpers/api/userApi";

test("Deve permitir login do recrutador", async ({ page, request }) => {
  const recruiter = createRecruiter();

  await UserApi.create(request, recruiter);

  const loginPage = new LoginPage(page);

  await loginPage.login(recruiter);

  await expect(page).toHaveURL(/homepage.html/);
});

test.describe("Login Collaborator", () => {
  test("Deve impedir login do colaborador sem liberação", async ({ page, request }) => {
    
    const collaborator = createCollaborator();

    await UserApi.create(request, collaborator);
    
    const loginPage = new LoginPage(page);

    await loginPage.login(collaborator);

    await loginPage.validarMensagemAguardandoLiberacao();
  });
});

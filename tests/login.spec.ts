import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import {
  createCollaborator,
  createRecruiter,
  createUserWithoutName,
  createUserWithoutPassword,
} from "../fixtures/user";
import { UserApi } from "../helpers/api/userApi";

test.describe("Happy Path", () => {
  test("Deve permitir login do recrutador", async ({ page, request }) => {
    const recruiter = createRecruiter();
    await UserApi.create(request, recruiter);
    const loginPage = new LoginPage(page);
    await loginPage.login(recruiter);
    await expect(page).toHaveURL(/homepage.html/);
  });

  test("Deve permitir login do colaborador", async ({ page, request }) => {});
});

test.describe("Validation", () => {
  test("Deve impedir login sem informar o usuário.", async ({ page }) => {
    const user = createUserWithoutName();
    const loginPage = new LoginPage(page);
    await loginPage.login(user);
    await loginPage.expectErrorMessage("Informe login e senha.");
    await loginPage.expectStayOnLoginPage();
  });

  test("Deve impedir login sem informar a senha.", async ({ page }) => {
    const user = createUserWithoutPassword();
    const loginPage = new LoginPage(page);
    await loginPage.login(user);
    await loginPage.expectErrorMessage("Informe login e senha.");
    await loginPage.expectStayOnLoginPage();
  });

  test("Deve impedir login com usuário inexistente.", async ({ page }) => {
    const user = createRecruiter();
    const loginPage = new LoginPage(page);
    await loginPage.login(user);
    await loginPage.expectErrorMessage("Usuario nao encontrado.");
    await loginPage.expectStayOnLoginPage();
  });

  test("Deve impedir login com senha incorreta.", async ({ page, request }) => {
    const user = createRecruiter();
    await UserApi.create(request, user);
    const invalidPasswordUser = {
      ...user,
      password: "senha-incorreta",
    };
    const loginPage = new LoginPage(page);
    await loginPage.login(invalidPasswordUser);
    await loginPage.expectErrorMessage("Usuario ou senha invalidos.");
    await loginPage.expectStayOnLoginPage();
  });
});

test.describe("Business Rules", () => {
  test("Deve impedir login do colaborador sem liberação", async ({
    page,
    request,
  }) => {
    const collaborator = createCollaborator();
    await UserApi.create(request, collaborator);
    const loginPage = new LoginPage(page);
    await loginPage.login(collaborator);
    await loginPage.expectPendingApprovalError();
  });
});

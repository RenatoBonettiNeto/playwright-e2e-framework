import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { validRecruiter } from "../fixtures/user";

test.describe("Login Recruiter", () => {
  test("Deve permitir que o recrutador faça login com sucesso", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(validRecruiter);
  });
});
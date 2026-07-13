import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { validRecruiter } from "../fixtures/user";

test.describe("Register Recruiter", () => {
  test("Deve cadastrar um recrutador com sucesso", async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.register(validRecruiter);
  });
});

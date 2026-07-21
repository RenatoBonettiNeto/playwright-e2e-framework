import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { createCollaborator, createRecruiter } from "../fixtures/user";
import { UserApi } from "../helpers/api/userApi";

test.describe("Register Recruiter", () => {
  test("Deve cadastrar um recrutador com sucesso", async ({
    page,
    request,
  }) => {
    const recruiter = createRecruiter();

    const registerPage = new RegisterPage(page);

    await registerPage.register(recruiter);
  });
});

test.describe("Register Collaborator", () => {
  test("Deve cadastrar um coalborador com sucesso", async ({ page }) => {
    const collaborator = createCollaborator();

    const registerPage = new RegisterPage(page);

    await registerPage.register(collaborator);
  });
});

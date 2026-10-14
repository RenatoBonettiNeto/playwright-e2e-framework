import { test, expect } from "@playwright/test";
import { UserApi } from "../helpers/api/userApi";
import { authenticate } from "../helpers/authentication";
import { createRecruiter } from "../fixtures/user";
import {
  createDepartment,
  createDepartmentOnlyWithName,
  createDepartmentWithNameContainingOnlySpaces,
  createDepartmentWithNameWhitespace,
  createDepartmentWithoutName,
} from "../fixtures/department";
import { DepartmentPage } from "../pages/DepartmentPage";
import { expectDepartmentPersistedAndListed } from "../helpers/expectDepartmentPersistedAndListed";

test.beforeEach(async ({ request, context }) => {
  const recruiter = createRecruiter();
  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);
});

test.describe("Cenário Feliz", () => {
  test("Deve permitir cadastrar o departamento com sucesso", async ({
    page,
    request,
  }) => {
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment();

    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url() === `${process.env.API_URL}departamentos` &&
          response.request().method() === "POST",
      ),
      departmentPage.create(department),
    ]);
    expect(response.status()).toBe(201);
    const { data: createdDepartment } = await response.json();

    await expect(page.locator("#mensagem")).toHaveText(
      "Departamento criado com sucesso.",
    );
    await expect(page.locator("#department-modal")).toBeHidden();

    await expectDepartmentPersistedAndListed(
      request,
      departmentPage,
      createdDepartment.id_departamento,
      department,
    );
  });

  test("Deve permitir cadastrar o departamento com somente o nome.", async ({
    page,
  }) => {
    const departmentPage = new DepartmentPage(page);
    const department = createDepartmentOnlyWithName();

    await departmentPage.create(department);
    await expect(page.locator("#mensagem")).toHaveText(
      "Departamento criado com sucesso.",
    );
  });
});

test.describe("Validações", () => {
  test("Não deve permitir cadastrar o departamento sem nome.", async ({
    page,
  }) => {
    const departmentPage = new DepartmentPage(page);
    const department = createDepartmentWithoutName();

    await departmentPage.create(department);
    await expect(page.locator("#mensagem")).toHaveText(
      "O nome do departamento é obrigatório.",
    );
  });

  test("Não deve permitir cadastrar o departamento com o nome contendo apenas espaços.", async ({
    page,
  }) => {
    const departmentPage = new DepartmentPage(page);
    const department = createDepartmentWithNameContainingOnlySpaces();

    await departmentPage.create(department);
    await expect(page.locator("#mensagem")).toHaveText(
      "O nome do departamento é obrigatório.",
    );
  });
});

test.describe("Regras de Negócio", () => {
  test("Deve cadastrar o departamento removendo espaços nas extremidades do nome.", async ({
    page,
    request,
  }) => {
    const departmentPage = new DepartmentPage(page);
    const department = createDepartmentWithNameWhitespace();

    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url() === `${process.env.API_URL}departamentos` &&
          response.request().method() === "POST",
      ),
      departmentPage.create(department),
    ]);
    expect(response.status()).toBe(201);
    const { data: createdDepartment } = await response.json();

    await expect(page.locator("#mensagem")).toHaveText(
      "Departamento criado com sucesso.",
    );

    const expectedDepartment = {
      ...department,
      name: department.name.trim(),
    };

    await expectDepartmentPersistedAndListed(
      request,
      departmentPage,
      createdDepartment.id_departamento,
      expectedDepartment,
    );
  });

  test("Não deve cadastrar o departamento ao cancelar o formulário", async ({
    page,
  }) => {
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment();

    await departmentPage.cancelCreation(department);

    await expect(page.locator("#department-modal")).toBeHidden();

    await departmentPage.query.search(department.name);
    await expect(page.locator("#departments-empty-state")).toBeVisible();

    await expect(
      departmentPage.query.getRecordRow(department.name),
    ).toHaveCount(0);
  });
});

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
import { DepartmentsApi } from "../helpers/api/departmentApi";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ request, context }) => {
  const recruiter = createRecruiter();
  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);
});

test.describe("Cenário Feliz", () => {
  test("Deve exibir estado vazio ao buscar um departamento inexistente", async ({
    page
  }) => {
    const departmentPage = new DepartmentPage(page);
    const searchTerm = `Inexistente ${faker.string.uuid()}`;

    await departmentPage.open();
    await departmentPage.query.search(searchTerm);

    await expect(page.locator("#departments-empty-state")).toBeVisible();
    await expect(page.locator("#departments-empty-state")).toHaveText(
      "Nenhum departamento encontrado.",
    );
    await expect(
      page.locator("#departments-table-body").getByRole("row"),
    ).toHaveCount(0);
  });

  test("Deve consultar o departamento pela sigla", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment({
      sigla: faker.string.uuid().slice(0, 8).toUpperCase(),
    });
    await departmentsApi.create(request, department);
    await departmentPage.open();
    await departmentPage.query.search(department.sigla);

    await departmentPage.query.expectRecord(department.name, {
      Nome: department.name,
      Sigla: department.sigla,
    });
  });

  test("Deve atualizar os dados do departamento com sucesso", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment();
    const createdDepartment = await departmentsApi.create(request, department);

    const updatedDepartment = {
      ...department,
      name: `${department.name} atualizado`,
      sigla: "AT",
      email_setorial: "atualizado@rh.com.br",
    };

    await departmentPage.open();
    await departmentPage.query.search(department.name);

    const row = departmentPage.query.getRecordRow(department.name);
    await expect(row).toHaveCount(1);
    await row.getByRole("button", { name: "Editar", exact: true }).click();

    await expect(page.locator("#department-modal")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Nome *" })).toHaveValue(
      department.name,
    );

    await departmentPage.fillName(updatedDepartment.name);
    await departmentPage.fillSigla(updatedDepartment.sigla);
    await departmentPage.fillSectoralEmail(updatedDepartment.email_setorial);

    await departmentPage.clickSave();

    await expect(page.locator("#mensagem")).toHaveText(
      "Departamento atualizado com sucesso.",
    );
    await expect(page.locator("#department-modal")).toBeHidden();

    await expectDepartmentPersistedAndListed(
      request,
      departmentPage,
      createdDepartment.id_departamento,
      updatedDepartment,
    );
  });

  test("Deve cadastrar o departamento vinculado a um departamento pai", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const parent = await departmentsApi.create(request, createDepartment());
    const department = createDepartment({
      departamento_pai: String(parent.id_departamento),
    });
    const departmentPage = new DepartmentPage(page);

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
      parent.id_departamento,
    );
    await departmentPage.expectChildInTree(parent.nome, department.name);
  });

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

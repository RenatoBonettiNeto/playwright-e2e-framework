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
import { RecordQueryApi } from "../helpers/api/recordQueryApi";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ request, context }) => {
  const recruiter = createRecruiter();
  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);
});

test.describe("Cenário Feliz", () => {
  test("Deve reativar um departamento inativo", async ({ page, request }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentQueryApi = new RecordQueryApi("departamentos");
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment({ status: "Inativo" });
    const createdDepartment = await departmentsApi.create(request, department);

    await departmentPage.open();
    await departmentPage.query.search(department.name);
    await departmentPage.query.expectRecord(department.name, {
      Status: "Inativo",
    });

    const endpoint = new URL(
      `departamentos/${createdDepartment.id_departamento}/restaurar`,
      process.env.API_URL,
    ).pathname;
    const [response] = await Promise.all([
      page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          response.request().method() === "PATCH" && url.pathname === endpoint
        );
      }),
      departmentPage.clickReactivate(department.name),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(page.locator("#mensagem")).toHaveText("Departamento reativado.");

    await departmentQueryApi.expectRecord(
      request,
      createdDepartment.id_departamento,
      {
        id_departamento: createdDepartment.id_departamento,
        nome: department.name,
        status: "Ativo",
        deleted_at: null,
        funcionarios_count: 0,
      },
    );

    await departmentPage.query.expectRecord(department.name, {
      Nome: department.name,
      Status: "Ativo",
    });
    await expect(
      departmentPage.query
        .getRecordRow(department.name)
        .getByRole("button", { name: "Inativar", exact: true }),
    ).toBeVisible();
  });

  test("Deve inativar um departamento sem cargos ou funcionários vinculados", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentQueryApi = new RecordQueryApi("departamentos");
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment({ status: "Ativo" });
    const createdDepartment = await departmentsApi.create(request, department);

    await departmentPage.open();
    await departmentPage.query.search(department.name);
    await departmentPage.query.expectRecord(department.name, {
      Status: "Ativo",
    });

    await departmentPage.clickInactivate(department.name);
    await expect(page.locator("#department-confirm-modal")).toBeVisible();
    await expect(page.locator("#department-confirm-title")).toHaveText(
      "Inativar departamento",
    );

    const endpoint = new URL(
      `departamentos/${createdDepartment.id_departamento}`,
      process.env.API_URL,
    ).pathname;
    const [response] = await Promise.all([
      page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          response.request().method() === "DELETE" && url.pathname === endpoint
        );
      }),
      departmentPage.confirmInactivation(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(page.locator("#department-confirm-modal")).toBeHidden();
    await expect(page.locator("#mensagem")).toHaveText("Departamento inativado.");

    await departmentQueryApi.expectRecord(
      request,
      createdDepartment.id_departamento,
      {
        id_departamento: createdDepartment.id_departamento,
        nome: department.name,
        status: "Inativo",
        deleted_at: null,
        funcionarios_count: 0,
      },
    );

    await departmentPage.query.expectRecord(department.name, {
      Nome: department.name,
      Status: "Inativo",
    });
    await expect(
      departmentPage.query
        .getRecordRow(department.name)
        .getByRole("button", { name: "Reativar", exact: true }),
    ).toBeVisible();
  });

  test("Deve restaurar a consulta ao limpar os filtros de departamentos", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentPage = new DepartmentPage(page);
    const commonTerm = `Filtro ${faker.string.uuid()}`;
    const activeDepartment = createDepartment({
      name: `${commonTerm} Ativo`,
      status: "Ativo",
    });
    const inactiveDepartment = createDepartment({
      name: `${commonTerm} Inativo`,
      status: "Inativo",
    });

    await departmentsApi.create(request, activeDepartment);
    await departmentsApi.create(request, inactiveDepartment);

    await departmentPage.open();
    await departmentPage.query.search(commonTerm);
    await departmentPage.filterByStatus("Ativo");

    await departmentPage.query.expectRecord(activeDepartment.name, {
      Status: "Ativo",
    });
    await expect(
      departmentPage.query.getRecordRow(inactiveDepartment.name),
    ).toHaveCount(0);

    const endpoint = new URL("departamentos", process.env.API_URL).pathname;
    const [response] = await Promise.all([
      page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          response.request().method() === "GET" &&
          url.pathname === endpoint &&
          url.searchParams.get("page") === "1" &&
          !url.searchParams.get("q") &&
          !url.searchParams.get("status") &&
          url.searchParams.get("tree") !== "true"
        );
      }),
      departmentPage.clearFilters(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(
      page.getByRole("searchbox", { name: "Busca", exact: true }),
    ).toHaveValue("");
    await expect(page.locator("#filter-status")).toHaveValue("");
    await expect(page.locator("#filter-tree-view")).toHaveValue("list");
    await expect(page.locator("#pagination-info")).toContainText("Página 1 de");

    const result = await response.json();
    expect(result.page).toBe(1);

    const rows = page.locator("#departments-table-body").getByRole("row");
    await expect(rows).toHaveCount(result.items.length);

    for (const department of result.items) {
      const row = rows.and(
        page.locator(`tr[data-id="${department.id_departamento}"]`),
      );
      await expect(row).toHaveCount(1);
      await expect(row).toBeVisible();
      await expect(
        row.getByRole("cell").nth(0).locator(".table-cell-title"),
      ).toHaveText(department.nome);
      await expect(row.getByRole("cell").nth(4)).toHaveText(department.status);
    }
  });

  test("Deve exibir apenas departamentos ativos ao filtrar pelo status Inativo", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentPage = new DepartmentPage(page);
    const commonTerm = `Filtro ${faker.string.uuid()}`;
    const activeDepartment = createDepartment({
      name: `${commonTerm} Ativo`,
      status: "Ativo",
    });
    const inactiveDepartment = createDepartment({
      name: `${commonTerm} Inativo`,
      status: "Inativo",
    });

    await departmentsApi.create(request, activeDepartment);
    await departmentsApi.create(request, inactiveDepartment);

    await departmentPage.open();
    await departmentPage.query.search(commonTerm);
    await departmentPage.filterByStatus("Inativo");

    await departmentPage.query.expectRecord(inactiveDepartment.name, {
      Status: "Inativo",
    });

    await expect(
      departmentPage.query.getRecordRow(activeDepartment.name),
    ).toHaveCount(0);
  });

  test("Deve exibir apenas departamentos ativos ao filtrar pelo status Ativo", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentPage = new DepartmentPage(page);
    const commonTerm = `Filtro ${faker.string.uuid()}`;
    const activeDepartment = createDepartment({
      name: `${commonTerm} Ativo`,
      status: "Ativo",
    });
    const inactiveDepartment = createDepartment({
      name: `${commonTerm} Inativo`,
      status: "Inativo",
    });

    await departmentsApi.create(request, activeDepartment);
    await departmentsApi.create(request, inactiveDepartment);

    await departmentPage.open();
    await departmentPage.query.search(commonTerm);
    await departmentPage.filterByStatus("Ativo");

    await departmentPage.query.expectRecord(activeDepartment.name, {
      Status: "Ativo",
    });

    await expect(
      departmentPage.query.getRecordRow(inactiveDepartment.name),
    ).toHaveCount(0);
  });

  test("Deve exibir estado vazio ao buscar um departamento inexistente", async ({
    page,
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
  test("Não deve excluir o departamento ao cancelar a confirmação", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentQueryApi = new RecordQueryApi("departamentos");
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment({ status: "Ativo" });
    const createdDepartment = await departmentsApi.create(request, department);
    const originalDepartment = await departmentQueryApi.getById(
      request,
      createdDepartment.id_departamento,
    );

    await departmentPage.open();
    await departmentPage.query.search(department.name);
    await departmentPage.query
      .getRecordRow(department.name)
      .getByRole("button", { name: "Editar", exact: true })
      .click();
    await expect(page.locator("#department-modal")).toBeVisible();

    await departmentPage.clickDelete();
    await expect(page.locator("#department-confirm-modal")).toBeVisible();
    await expect(page.locator("#department-confirm-title")).toHaveText(
      "Excluir departamento",
    );

    await departmentPage.cancelConfirmation();
    await expect(page.locator("#department-confirm-modal")).toBeHidden();
    await expect(page.locator("#department-modal")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Nome *" })).toHaveValue(
      department.name,
    );

    const savedDepartment = await departmentQueryApi.getById(
      request,
      createdDepartment.id_departamento,
    );
    expect(savedDepartment).toEqual(originalDepartment);

    await departmentPage.open();
    await departmentPage.query.search(department.name);
    await departmentPage.query.expectRecord(department.name, {
      Nome: department.name,
      Sigla: department.sigla,
      "E-mail setorial": department.email_setorial,
      Status: "Ativo",
    });
  });

  test("Não deve inativar o departamento ao cancelar a confirmação", async ({
    page,
    request,
  }) => {
    const departmentsApi = new DepartmentsApi();
    const departmentQueryApi = new RecordQueryApi("departamentos");
    const departmentPage = new DepartmentPage(page);
    const department = createDepartment({ status: "Ativo" });
    const createdDepartment = await departmentsApi.create(request, department);
    const originalDepartment = await departmentQueryApi.getById(
      request,
      createdDepartment.id_departamento,
    );
    expect(originalDepartment.status).toBe("Ativo");

    await departmentPage.open();
    await departmentPage.query.search(department.name);
    await departmentPage.query.expectRecord(department.name, {
      Status: "Ativo",
    });

    await departmentPage.clickInactivate(department.name);
    await expect(page.locator("#department-confirm-modal")).toBeVisible();
    await expect(page.locator("#department-confirm-title")).toHaveText(
      "Inativar departamento",
    );

    await departmentPage.cancelConfirmation();
    await expect(page.locator("#department-confirm-modal")).toBeHidden();

    const savedDepartment = await departmentQueryApi.getById(
      request,
      createdDepartment.id_departamento,
    );
    expect(savedDepartment).toEqual(originalDepartment);

    await departmentPage.open();
    await departmentPage.query.search(department.name);
    await departmentPage.query.expectRecord(department.name, {
      Nome: department.name,
      Sigla: department.sigla,
      "E-mail setorial": department.email_setorial,
      Status: "Ativo",
    });
    await expect(
      departmentPage.query
        .getRecordRow(department.name)
        .getByRole("button", { name: "Inativar", exact: true }),
    ).toBeVisible();
  });

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

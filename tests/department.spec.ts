import { test, expect } from "@playwright/test";
import { UserApi } from "../helpers/api/userApi";
import { authenticate } from "../helpers/authentication";
import { createRecruiter } from "../fixtures/user";
import { createDepartment } from "../fixtures/department";
import { DepartmentPage } from "../pages/DepartmentPage";
import { RecordQueryApi } from "../helpers/api/recordQueryApi";

test("Deve permitir cadastrar o departamento com sucesso", async ({
  page,
  request,
  context,
}) => {
  const recruiter = createRecruiter();
  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);

  const departmentPage = new DepartmentPage(page);
  const department = createDepartment();

  const [response] = await Promise.all([
    page.waitForResponse((response) =>
      response.url() === `${process.env.API_URL}departamentos` &&
      response.request().method() === "POST",
    ),
    departmentPage.create(department),
  ]);
  expect(response.status()).toBe(201);
  const { data: createdDepartment } = await response.json();

  await expect(page.locator("#mensagem")).toHaveText("Departamento criado com sucesso.");
  await expect(page.locator("#department-modal")).toBeHidden();

  const departmentQueryApi = new RecordQueryApi("departamentos");
  await departmentQueryApi.expectRecord(request, createdDepartment.id_departamento, {
    nome: department.name,
    sigla: department.sigla,
    parent_departamento_id: null,
    email_setorial: department.email_setorial,
    localizacao: department.localizacao,
    missao: department.missao,
    objetivos: department.objetivos,
    status: "Ativo",
  });

  await departmentPage.query.search(department.name);
  await departmentPage.query.expectRecord(department.name, {
    "Nome": department.name,
    "Sigla": department.sigla,
    "E-mail setorial": department.email_setorial,
    "Status": "Ativo",
  });
});

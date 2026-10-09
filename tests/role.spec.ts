import { test, expect } from "@playwright/test";
import { UserApi } from "../helpers/api/userApi";
import { DepartmentsApi } from "../helpers/api/departmentApi";
import { authenticate } from "../helpers/authentication";
import { createRecruiter } from "../fixtures/user";
import { createDepartment } from "../fixtures/department";
import { createRole } from "../fixtures/role";
import { RolePage } from "../pages/RolePage";
import { RecordQueryApi } from "../helpers/api/recordQueryApi";

test("Deve permitir cadastrar o cargo com sucesso", async ({
  page,
  request,
  context,
}) => {
  const recruiter = createRecruiter();
  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);

  const departmentsApi = new DepartmentsApi();
  const department = await departmentsApi.create(request, createDepartment());

  const rolePage = new RolePage(page);
  const role = createRole(department.id_departamento);

  const [response] = await Promise.all([
    page.waitForResponse((response) =>
      response.url() === `${process.env.API_URL}cargos` &&
      response.request().method() === "POST",
    ),
    rolePage.create(role),
  ]);
  expect(response.status()).toBe(201);
  const { data: createdRole } = await response.json();

  await expect(page.locator("#mensagem")).toHaveText("Cargo criado com sucesso.");
  await expect(page.locator("#role-modal")).toBeHidden();

  const roleQueryApi = new RecordQueryApi("cargos");
  await roleQueryApi.expectRecord(request, createdRole.id_cargo, {
    nome: role.nome,
    descricao: role.descricao,
    departamento_id: role.departamento_id,
    modelo_trabalho: role.modelo_trabalho,
    jornada: role.jornada,
    regime_contratual: role.regime_contratual,
    escolaridade_minima: role.escolaridade_minima,
    tempo_experiencia_meses: role.tempo_experiencia_meses,
    requisitos_minimos: role.requisitos_minimos,
    requisitos_desejaveis: role.requisitos_desejaveis,
    objetivos: role.objetivos,
    status: "Ativo",
  });

  await rolePage.query.search(role.nome);
  await rolePage.query.expectRecord(role.nome, {
    "Cargo": role.nome,
    "Departamento": department.nome,
    "Modelo": role.modelo_trabalho!,
    "Regime": role.regime_contratual!,
    "Objetivos": role.objetivos,
    "Status": "Ativo",
  });
});

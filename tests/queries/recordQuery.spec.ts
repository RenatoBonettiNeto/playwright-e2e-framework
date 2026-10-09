import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createRecruiter } from "../../fixtures/user";
import { createDepartment } from "../../fixtures/department";
import { createRole } from "../../fixtures/role";
import { authenticate } from "../../helpers/authentication";
import { UserApi } from "../../helpers/api/userApi";
import { DepartmentsApi } from "../../helpers/api/departmentApi";
import { RolesApi } from "../../helpers/api/rolesApi";
import { RecordQueryApi } from "../../helpers/api/recordQueryApi";
import { RecordQueryPage } from "../../pages/RecordQueryPage";

test.beforeEach(async ({ request, context }) => {
  const recruiter = createRecruiter();
  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);
});

test("Deve consultar a skill na API e na tabela", async ({ page, request }) => {
  const skill = { nome: `Skill ${faker.string.uuid()}`, descricao: "Consulta de skill cadastrada" };
  const response = await request.post(`${process.env.API_URL}skills`, { data: skill });
  expect(response.status()).toBe(201);
  const { data: createdSkill } = await response.json();

  const queryApi = new RecordQueryApi("skills");
  await queryApi.expectRecord(request, createdSkill.id, { ...skill, status: "Ativo" });

  const queryPage = new RecordQueryPage(page, "skills");
  await queryPage.open();
  await queryPage.search(skill.nome);
  await queryPage.expectRecord(skill.nome, {
    "Skill": skill.nome,
    "Descrição": skill.descricao,
    "Status": "Ativo",
  });
  // Uma segunda consulta com o mesmo termo não deve aguardar uma nova requisição.
  await queryPage.search(skill.nome);
  await expect(queryPage.getRecordRow(skill.nome)).toHaveCount(1);
});

test("Deve consultar a vaga pelo ID na API e na tabela sem busca textual", async ({ page, request }) => {
  const department = await new DepartmentsApi().create(request, createDepartment());
  const role = await new RolesApi().create(request, createRole(department.id_departamento));
  const vacancy = {
    titulo: `Vaga ${faker.string.uuid()}`,
    descricao: "Consulta de vaga cadastrada",
    departamento_id: department.id_departamento,
    setor_id: role.id_cargo,
  };
  const response = await request.post(`${process.env.API_URL}vagas/register`, { data: vacancy });
  expect(response.status()).toBe(201);
  const { vaga: createdVacancy } = await response.json();

  const queryApi = new RecordQueryApi("vagas");
  await queryApi.expectRecord(request, createdVacancy.id_vaga, vacancy);

  const queryPage = new RecordQueryPage(page, "vacancies");
  await queryPage.open();
  await queryPage.expectRecord(String(createdVacancy.id_vaga), {
    "ID": String(createdVacancy.id_vaga),
    "Título": vacancy.titulo,
    "Departamento": department.nome,
    "Setor": role.nome,
    "Descrição": vacancy.descricao,
  });
});

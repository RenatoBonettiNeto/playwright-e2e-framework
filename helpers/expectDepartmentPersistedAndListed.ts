import { APIRequestContext } from "@playwright/test";
import { Department } from "../fixtures/department";
import { DepartmentPage } from "../pages/DepartmentPage";
import { RecordQueryApi } from "./api/recordQueryApi";

export async function expectDepartmentPersistedAndListed(
  request: APIRequestContext,
  departmentPage: DepartmentPage,
  departmentId: number,
  expectedDepartment: Department,
) {
  const departmentQueryApi = new RecordQueryApi("departamentos");

  await departmentQueryApi.expectRecord(request, departmentId, {
    nome: expectedDepartment.name,
    sigla: expectedDepartment.sigla,
    parent_departamento_id: null,
    email_setorial: expectedDepartment.email_setorial,
    localizacao: expectedDepartment.localizacao,
    missao: expectedDepartment.missao,
    objetivos: expectedDepartment.objetivos,
    status: "Ativo",
  });

  await departmentPage.query.search(expectedDepartment.name);

  await departmentPage.query.expectRecord(expectedDepartment.name, {
    "Nome": expectedDepartment.name,
    "Sigla": expectedDepartment.sigla,
    "E-mail setorial": expectedDepartment.email_setorial,
    "Status": "Ativo",
  });
}
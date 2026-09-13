import { test, expect } from "@playwright/test";
import { UserApi } from "../helpers/api/userApi";
import { DepartmentsApi } from "../helpers/api/departmentApi";
import { authenticate } from "../helpers/authentication";
import { createRecruiter } from "../fixtures/user";
import { createDepartment } from "../fixtures/department";
import { createRole } from "../fixtures/role";
import { RolePage } from "../pages/RolePage";

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

  await rolePage.create(role);

  await expect(page.locator("#mensagem")).toHaveText("Cargo criado com sucesso.");
});

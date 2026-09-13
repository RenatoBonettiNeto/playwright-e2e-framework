import { test, expect } from "@playwright/test";
import { UserApi } from "../helpers/api/userApi";
import { authenticate } from "../helpers/authentication";
import { createRecruiter } from "../fixtures/user";
import { createDepartment } from "../fixtures/department";
import { DepartmentPage } from "../pages/DepartmentPage";

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

  await departmentPage.create(department);
  
});
import { test } from "@playwright/test";
import { EmployeePage } from "../pages/EmployeePage";
import { createEmployee } from "../fixtures/employee";
import { createRecruiter } from "../fixtures/user";
import { UserApi } from "../helpers/api/userApi";
import { RolesApi } from "../helpers/api/rolesApi";
import { DepartmentsApi } from "../helpers/api/DepartmentApi";
import { createDepartment } from "../fixtures/department";
import { createRole } from "../fixtures/role";
import { authenticate } from "../helpers/authentication";

test.only("Deve ser possível criar o funcionário com sucesso", async ({
  page,
  request,
  context,
}) => {
  const departmentsApi = new DepartmentsApi();
  const rolesApi = new RolesApi();

  const recruiter = createRecruiter();

  await UserApi.create(request, recruiter);
  await authenticate(request, context, recruiter);

  const department = await departmentsApi.create(request, createDepartment());
  const role = await rolesApi.create(
    request,
    createRole(department.id_departamento),
  );

  console.log(role);

  const employee = createEmployee(department.id_departamento, role.id_cargo);

  const employeePage = new EmployeePage(page);

  await employeePage.open();
  await employeePage.clickButtonNewEmployee();

  await employeePage.personalDataTab.fill(employee);

  await employeePage.employeeModal.goToOrganizationTab();
  await employeePage.organizationalBondTab.fill(employee);

  await employeePage.employeeModal.clickSave();
});

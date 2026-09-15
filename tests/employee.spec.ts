import { test, expect } from "@playwright/test";
import { EmployeePage } from "../pages/EmployeePage";
import { createEmployee } from "../fixtures/employee";
import { createRecruiter } from "../fixtures/user";
import { UserApi } from "../helpers/api/userApi";
import { RolesApi } from "../helpers/api/rolesApi";
import { DepartmentsApi } from "../helpers/api/departmentApi";
import { createDepartment } from "../fixtures/department";
import { createRole } from "../fixtures/role";
import { authenticate } from "../helpers/authentication";

test("Deve ser possível criar o funcionário com sucesso", async ({
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

  const employee = createEmployee(department.id_departamento, role.id_cargo);

  const employeePage = new EmployeePage(page);

  const [response] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === `${process.env.API_URL}funcionarios` &&
        response.request().method() === "POST",
    ),
    employeePage.create(employee),
  ]);

  await expect(page.locator("#mensagem")).toHaveText("Funcionário criado com sucesso.");
  await expect(page.locator("#employee-modal")).toBeHidden();

  expect(response.status()).toBe(201);
  const { data: createdEmployee } = await response.json();

  const savedResponse = await request.get(
    `${process.env.API_URL}funcionarios/${createdEmployee.id_funcionario}`,
  );
  expect(savedResponse.ok()).toBeTruthy();
  const { data: savedEmployee } = await savedResponse.json();

  expect(savedEmployee).toMatchObject({
    nome_completo: employee.nomeCompleto,
    cpf: employee.cpf,
    data_nascimento: employee.dataNascimento,
    genero: employee.genero,
    email_corporativo: employee.emailCorporativo,
    email_pessoal: employee.emailPessoal,
    departamento_id: employee.departamentoId,
    cargo_id: employee.cargoId,
    status: employee.status,
    data_admissao: employee.dataAdmissao,
    modelo_trabalho: employee.modeloTrabalho,
    jornada: employee.jornada,
    nivel_carreira: employee.nivelCarreira,
    areas_interesse: employee.areasInteresse,
    pretensao_movimentacao: employee.pretensaoMovimentacao,
    telefone: employee.telefone,
    cidade: employee.cidade,
    uf: employee.uf,
    pais: employee.pais,
    observacoes: employee.observacoes,
    user_id: null,
  });
  expect(savedEmployee.matricula).toEqual(expect.any(String));
  expect(savedEmployee.matricula.length).toBeGreaterThan(0);

  await employeePage.search(employee.emailCorporativo);
  const employeeRow = employeePage.getEmployeeRow(employee.emailCorporativo);
  for (const value of [
    savedEmployee.matricula,
    employee.nomeCompleto,
    department.nome,
    role.nome,
    employee.status,
  ]) {
    await expect(employeeRow.getByRole("cell", { name: value, exact: true })).toBeVisible();
  }
});

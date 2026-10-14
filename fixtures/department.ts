import { faker } from "@faker-js/faker";

export interface Department {
  name: string;
  sigla: string;
  descricao: string;
  departamento_pai: string;
  email_setorial: string;
  localizacao: string;
  missao: string;
  objetivos: string;
}

export function createDepartment(overrides: Partial<Department> = {}): Department {
  return {
    name: `Departamento ${faker.string.uuid()}`,
    sigla: "DP",
    descricao: "Teste de inclusão do departamento.",
    departamento_pai: "",
    email_setorial: "departamento@rh.com.br",
    localizacao: "Braço do Norte, Santa Catarina",
    missao: "Criar o departamento.",
    objetivos: "Criar o departamento.",
    ...overrides,
  };
}

export function createDepartmentOnlyWithName(): Department {
  return createDepartment({
    sigla: "",
    descricao: "",
    departamento_pai: "",
    email_setorial: "",
    localizacao: "",
    missao: "",
    objetivos: "",
  });
}

export function createDepartmentWithoutName(): Department {
  return createDepartment({
    name: "",
  });
}

export function createDepartmentWithNameContainingOnlySpaces(): Department {
  return createDepartment({
    name: "   ",
  });
}

export function createDepartmentWithNameWhitespace(): Department {
  const department = createDepartment();

  return {
    ...department,
    name: `   ${department.name}   `,
  };
}

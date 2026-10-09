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

export function createDepartment(): Department {
  return {
    name: `Departamento ${faker.string.uuid()}`,
    sigla: "DP",
    descricao: "Teste de inclusão do departamento.",
    departamento_pai: "",
    email_setorial: "departamento@rh.com.br",
    localizacao: "Braço do Norte, Santa Catarina",
    missao: "Criar o departamento.",
    objetivos: "Criar o departamento.",
  };
}

export function createDepartmentOnlyWithName(): Department {
  return {
    name: `Departamento ${faker.string.uuid()}`,
    sigla: "",
    descricao: "",
    departamento_pai: "",
    email_setorial: "",
    localizacao: "",
    missao: "",
    objetivos: "",
  };
}

export function createDepartmentWithoutName(): Department {
  return {
    name: "",
    sigla: "DP",
    descricao: "Teste de inclusão do departamento.",
    departamento_pai: "",
    email_setorial: "departamento@rh.com.br",
    localizacao: "Braço do Norte, Santa Catarina",
    missao: "Criar o departamento.",
    objetivos: "Criar o departamento.",
  };
}

export function createDepartmentWithNameContainingOnlySpaces(): Department {
  return {
    name: "   ",  
    sigla: "DP",
    descricao: "Teste de inclusão do departamento.",
    departamento_pai: "",
    email_setorial: "departamento@rh.com.br",
    localizacao: "Braço do Norte, Santa Catarina",
    missao: "Criar o departamento.",
    objetivos: "Criar o departamento.",
  };
}
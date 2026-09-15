import { faker } from "@faker-js/faker";

export interface Employee {
  nomeCompleto: string;
  cpf: string;
  emailCorporativo: string;
  emailPessoal: string;
  dataNascimento: string;
  genero: string;

  departamentoId: number;
  cargoId: number;

  dataAdmissao: string;
  status: string;
  modeloTrabalho: string;
  jornada: string;
  nivelCarreira: string;
  areasInteresse: string;
  pretensaoMovimentacao: string;
  telefone: string;
  cidade: string;
  uf: string;
  pais: string;
  observacoes: string;
}

function createCPF(): string {
  const digits = Array.from({ length: 9 }, () => faker.number.int({ min: 0, max: 9 }));
  if (digits.every((digit) => digit === digits[0])) {
    digits[0] = (digits[0] + 1) % 10;
  }
  for (const weight of [10, 11]) {
    const sum = digits.reduce((total, digit, index) => total + digit * (weight - index), 0);
    const remainder = sum % 11;
    digits.push(remainder < 2 ? 0 : 11 - remainder);
  }
  return digits.join("");
}

export function createEmployee(
  departamentoId: number,
  cargoId: number,
  overrides?: Partial<Employee>,
): Employee {
  return {
    nomeCompleto: faker.person.fullName(),
    cpf: createCPF(),
    dataNascimento: "2003-08-28",
    genero: "Masculino",
    emailCorporativo: faker.internet.email().toLowerCase(),
    emailPessoal: faker.internet.email().toLowerCase(),

    departamentoId,
    cargoId,

    dataAdmissao: "2026-07-30",
    status: "Ativo",
    modeloTrabalho: "Hibrido",
    jornada: "40h semanais",
    nivelCarreira: "Pleno",
    areasInteresse: "Qualidade de software e desenvolvimento",
    pretensaoMovimentacao: "Atuar na equipe de automação de testes",
    telefone: "11987654321",
    cidade: "São Paulo",
    uf: "SP",
    pais: "Brasil",
    observacoes: "Funcionário cadastrado pelo teste automatizado.",
    ...overrides,
  };
}

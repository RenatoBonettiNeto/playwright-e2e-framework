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
}

export function createEmployee(departamentoId: number, cargoId: number,  overrides?: Partial<Employee>): Employee {
  return {
    nomeCompleto: "Teste Funcionário",
    cpf: "000.000.000-00",
    dataNascimento: "08/28/2003",
    genero: "Masculino",
    emailCorporativo: "teste@teste.com.br",
    emailPessoal: "pessoal@teste.com.br",

    departamentoId,
    cargoId,

    dataAdmissao: "30/07/2026",
    status: "Ativo",
  };
}

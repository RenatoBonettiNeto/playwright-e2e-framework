export interface Employee {
  nomeCompleto: string;
  cpf: string;
  emailCorporativo: string;
  dataNascimento: string;
  genero: string;

  departamentoId: number;
  cargoId: number;

  dataAdmissao: string;
  status: string;
}
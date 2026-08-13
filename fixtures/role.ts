export interface Role {
    nome: string,
    descricao: string,
    jornada: string,
    requisitos_minimos: string,
    requisitos_desejaveis: string
    objetivos: string
    departamento_id: number
}

export function createRole(departmentId: number): Role {
  return {
    nome: "Cargo",
    descricao: "CG",
    jornada: "Teste.",
    requisitos_minimos: "Teste",
    requisitos_desejaveis: "Teste",
    objetivos: "Teste",
    departamento_id: departmentId,
  };
}

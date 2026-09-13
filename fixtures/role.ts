export interface Role {
    nome: string,
    descricao: string,
    jornada: string,
    requisitos_minimos: string,
    requisitos_desejaveis: string
    objetivos: string
    departamento_id: number
    modelo_trabalho?: string
    regime_contratual?: string
    escolaridade_minima?: string
    tempo_experiencia_meses?: number
}

export function createRole(departmentId: number): Role {
  return {
    nome: "Cargo",
    descricao: "Teste de inclusão de cargo",
    jornada: "40H",
    requisitos_minimos: "Teste",
    requisitos_desejaveis: "Teste",
    objetivos: "Teste",
    departamento_id: departmentId,
    modelo_trabalho: "Presencial",
    regime_contratual: "CLT",
    escolaridade_minima: "Graduação",
    tempo_experiencia_meses: 12,
  };
}

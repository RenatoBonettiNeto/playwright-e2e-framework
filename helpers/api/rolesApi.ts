import { APIRequestContext } from "@playwright/test";
import { Role } from "../../fixtures/role";
import dotenv from "dotenv";

export class RolesApi {
  async create(request: APIRequestContext, role: Role) {
    const response = await request.post(`${process.env.API_URL}cargos`, {
      data: {
        nome: role.nome,
        descricao: role.descricao,
        jornada: role.jornada,
        requisitos_minimos: role.requisitos_minimos,
        requisitos_desejaveis: role.requisitos_desejaveis,
        objetivos: role.objetivos,
      },
    });

    if (!response.ok()) {
      throw new Error(`
      Falha ao criar cargo.
      Status: ${response.status()}
      Resposta: ${await response.text()}
    `);
    }
    const body = await response.json();
    return body;
  }
}

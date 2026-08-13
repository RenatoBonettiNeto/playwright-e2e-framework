import { APIRequestContext } from "@playwright/test";
import { Department } from "../../fixtures/department";
import dotenv from "dotenv";


export class DepartmentsApi {
  async create(request: APIRequestContext, department: Department) {
    const response = await request.post(
      `${process.env.API_URL}departamentos`,
      {
        data: {
          nome: department.name,
          sigla: department.sigla,
          descricao: department.descricao,
          email_setorial: department.email_setorial,
          localizacao: department.localizacao,
          missao: department.missao,
          objetivos: department.objetivos,
        },
      }
    );

    if (!response.ok()) {
      throw new Error(`
        Falha ao criar departamento.
        Status: ${response.status()}
        Resposta: ${await response.text()}
      `);
    }

    const body = await response.json();
    const data = body.data;

    return {
      id: data.id_departamento,
      ...data,
    };
  }
}
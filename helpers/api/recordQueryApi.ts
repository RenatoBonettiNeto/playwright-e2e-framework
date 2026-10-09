import { APIRequestContext, expect } from "@playwright/test";

type Resource = "funcionarios" | "departamentos" | "cargos" | "skills" | "vagas";

export class RecordQueryApi {
  constructor(private resource: Resource) {}

  async getById(request: APIRequestContext, id: number) {
    const url = new URL(`${this.resource}/${id}`, process.env.API_URL).toString();
    const response = await request.get(url);
    await expect(response).toBeOK();
    const body = await response.json();
    const record = this.resource === "vagas" ? body.vaga : body.data;
    expect(record, `Registro retornado por GET ${url}`).toEqual(expect.any(Object));
    return record;
  }

  async expectRecord(
    request: APIRequestContext,
    id: number,
    expected: Record<string, unknown>,
  ) {
    const record = await this.getById(request, id);
    expect(record).toMatchObject(expected);
    return record;
  }
}

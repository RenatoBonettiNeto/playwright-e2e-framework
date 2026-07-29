import { APIRequestContext, expect } from "@playwright/test";
import { User } from "../../fixtures/user";
import dotenv from "dotenv";

export class AuthApi {
  async login(request: APIRequestContext, user: User) {
    const response = await request.post(
      `${process.env.API_URL}usuarios/login`,
      {
        data: {
          login: user.name,
          senha: user.password,
          tipo: user.type,
        },
      },
    );

    if (!response.ok()) {
      throw new Error(`
      Login falhou.
      Status: ${response.status()}
      Resposta: ${await response.text()}
`);
    }
  }
}

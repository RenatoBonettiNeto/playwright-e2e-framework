import { APIRequestContext, expect } from "@playwright/test";
import { User } from "../../fixtures/user";
import dotenv from "dotenv";

export class UserApi {
  static async create(request: APIRequestContext, user: User) {
    const response = await request.post(
      `${process.env.API_URL}/usuarios/register`,
      {
        data: {
          nome: user.name,
          email: user.email,
          senha: user.password,
          tipo: user.type,
        },
      },
    );

    expect(response.status()).toBe(201);
  }
}

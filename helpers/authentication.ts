import { APIRequestContext, BrowserContext } from "@playwright/test";
import { AuthApi } from "./api/authApi";
import { User } from "../fixtures/user";

const authApi = new AuthApi();

export async function authenticate(
  request: APIRequestContext,
  context: BrowserContext,
  user: User,
) {
  await authApi.login(request, user);

  const state = await request.storageState();

  await context.addCookies(state.cookies);
}

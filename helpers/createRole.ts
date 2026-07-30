import { APIRequestContext } from "@playwright/test";
import { RolesApi } from "./api/rolesApi";
import { Role } from "../fixtures/role";

const roleApi = new RolesApi();

export async function createRole(
    request: APIRequestContext, role: Role) {
  return await roleApi.create(request, role);
}

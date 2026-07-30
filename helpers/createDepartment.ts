import { APIRequestContext } from "@playwright/test";
import { DepartmentsApi } from "./api/DepartmentApi";
import { Department } from "../fixtures/department";

const departmentApi = new DepartmentsApi();

export async function createDepartment(
  request: APIRequestContext, department: Department) {
  return await departmentApi.create(request, department);
}

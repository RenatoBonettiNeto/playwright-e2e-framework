import { faker } from "@faker-js/faker";

export enum UserType {
  Collaborator = "C",
  Recruiter = "R",
}

export interface User {
  type: UserType;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function createRecruiter(): User {
  return {
    type: UserType.Recruiter,
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: "12345678",
    confirmPassword: "12345678",
  };
}

export function createCollaborator(): User {
  return {
    type: UserType.Collaborator,
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: "12345678",
    confirmPassword: "12345678",
  };
}
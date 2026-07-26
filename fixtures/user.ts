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

export function createUserWithInvalidEmail(): User {
  const user = createRecruiter();
  return {
    ...user,
    email: "email-invalido",
  };
}

export function createUserWithShortPassword(): User {
  const user = createRecruiter();
  return {
    ...user,
    password: "1234",
    confirmPassword: "1234",
  };
}

export function createUserWithDifferentPasswords(): User {
  const user = createRecruiter();
  return {
    ...user,
    password: "12345678",
    confirmPassword: "1234",
  };
}

export function createUserWithoutName(): User {
  const user = createRecruiter();
  return {
    ...user,
    name: "",
  };
}

export function createUserWithoutEmail(): User {
  const user = createRecruiter();
  return {
    ...user,
    email: "",
  };
}

export function createUserWithoutPassword(): User {
  const user = createRecruiter();
  return {
    ...user,
    password: "",
  };
}

export function createUserWithoutConfirmPassword(): User {
  const user = createRecruiter();
  return {
    ...user,
    confirmPassword: "",
  };
}


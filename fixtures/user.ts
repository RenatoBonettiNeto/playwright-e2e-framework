export enum UserType {
  Collabortor = "C",
  Recruiter = "R",
}

export interface User {
  type: UserType;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const validCollaborator: User = {
  type: UserType.Collabortor,
  name: "RenatoTeste",
  email: "renato@email.com.br",
  password: "12345678",
  confirmPassword: "12345678",
};

export const validRecruiter: User = {
  type: UserType.Recruiter,
  name: "RH Empresa",
  email: "rh@email.com.br",
  password: "12345678",
  confirmPassword: "12345678",
};

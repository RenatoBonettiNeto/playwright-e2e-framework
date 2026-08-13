import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { EmployeeModal } from "./employee/EmployeeModal";
import { OrganizationalBondTab } from "./employee/OrganizationalBondTab";
import { PersonalDataTab } from "./employee/PersonalDataTab";
import { createEmployee } from "../fixtures/employee";

export class EmployeePage extends BasePage {
  readonly employeeModal: EmployeeModal;
  readonly personalDataTab: PersonalDataTab;
  readonly organizationalBondTab: OrganizationalBondTab;

  constructor(page: Page) {
    super(page);

    this.employeeModal = new EmployeeModal(page);
    this.personalDataTab = new PersonalDataTab(page);
    this.organizationalBondTab = new OrganizationalBondTab(page);
  }

  async open() {
    await this.page.goto("employees.html");
  }

  async clickButtonNewEmployee() {
    await this.page
      .getByRole("button", {
        name: "Novo funcionário",
      })
      .click();
  }

}

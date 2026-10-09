import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { RecordQueryPage } from "./RecordQueryPage";
import { EmployeeModal } from "./employee/EmployeeModal";
import { OrganizationalBondTab } from "./employee/OrganizationalBondTab";
import { PersonalDataTab } from "./employee/PersonalDataTab";
import { Employee } from "../fixtures/employee";
import { WorkTab } from "./employee/WorkTab";
import { InternalMobilityTab } from "./employee/InternalMobilityTab";
import { ContactTab } from "./employee/ContactTab";
import { LocationTab } from "./employee/LocationTab";
import { ObservationsTab } from "./employee/ObservationsTab";

export class EmployeePage extends BasePage {
  readonly query: RecordQueryPage;
  readonly employeeModal: EmployeeModal;
  readonly personalDataTab: PersonalDataTab;
  readonly organizationalBondTab: OrganizationalBondTab;
  readonly workTab: WorkTab;
  readonly internalMobilityTab: InternalMobilityTab;
  readonly contactTab: ContactTab;
  readonly locationTab: LocationTab;
  readonly observationsTab: ObservationsTab;

  constructor(page: Page) {
    super(page);
    this.query = new RecordQueryPage(page, "employees");

    this.employeeModal = new EmployeeModal(page);
    this.personalDataTab = new PersonalDataTab(page);
    this.organizationalBondTab = new OrganizationalBondTab(page);
    this.workTab = new WorkTab(page);
    this.internalMobilityTab = new InternalMobilityTab(page);
    this.contactTab = new ContactTab(page);
    this.locationTab = new LocationTab(page);
    this.observationsTab = new ObservationsTab(page);
  }

  async open() {
    await this.query.open();
  }

  async clickButtonNewEmployee() {
    await this.page
      .getByRole("button", {
        name: "Novo funcionário",
      })
      .click();
  }

  async search(email: string) {
    await this.query.search(email);
  }

  getEmployeeRow(email: string) {
    return this.query.getRecordRow(email);
  }

  async create(employee: Employee) {
    await this.open();
    await this.clickButtonNewEmployee();
    await this.personalDataTab.fill(employee);
    await this.employeeModal.goToOrganizationTab();
    await this.organizationalBondTab.fill(employee);
    await this.employeeModal.goToWorkTab();
    await this.workTab.fill(employee);
    await this.employeeModal.goToInternalMobilityTab();
    await this.internalMobilityTab.fill(employee);
    await this.employeeModal.goToContactTab();
    await this.contactTab.fill(employee);
    await this.employeeModal.goToLocationTab();
    await this.locationTab.fill(employee);
    await this.employeeModal.goToObservationsTab();
    await this.observationsTab.fill(employee);
    await this.employeeModal.clickSave();
  }
}

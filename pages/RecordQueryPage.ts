import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

const queryScreens = {
  employees: { path: "employees.html", body: "#employees-table-body", searchResource: "funcionarios" },
  departments: { path: "departments.html", body: "#departments-table-body", searchResource: "departamentos" },
  roles: { path: "roles.html", body: "#roles-table-body", searchResource: "cargos" },
  skills: { path: "skills.html", body: "#skills-table-body", searchResource: "skills" },
  vacancies: { path: "vacancy.html", body: "#vacancy-table tbody", searchResource: null },
} as const;

export class RecordQueryPage extends BasePage {
  private readonly screen;

  constructor(page: Page, screen: keyof typeof queryScreens) {
    super(page);
    this.screen = queryScreens[screen];
  }

  async open() {
    await this.page.goto(this.screen.path);
    // Os eventos de Cargos e Departamentos só são registrados após a carga inicial.
    if (this.screen.path === "departments.html") {
      await expect(this.page.locator("#departments-tree")).toHaveText(/\S/);
    } else if (this.screen.path === "roles.html" || this.screen.path === "employees.html") {
      await expect(this.page.locator("#pagination-info")).toHaveText(/\S/);
    } else if (this.screen.path === "skills.html") {
      await expect(this.page.locator("#skills-pagination-info")).toHaveText(/\S/);
    }
  }

  async search(term: string) {
    if (!this.screen.searchResource) {
      throw new Error(`${this.screen.path} não possui busca textual. Consulte a linha pelo ID ou título.`);
    }
    const search = this.page.getByRole("searchbox", { name: "Busca", exact: true });
    // A mesma busca pode ser reutilizada em várias validações sem esperar outra requisição.
    if (await search.inputValue() === term) return;

    const endpoint = new URL(this.screen.searchResource, process.env.API_URL).pathname;
    const [response] = await Promise.all([
      this.page.waitForResponse((response) => {
        const url = new URL(response.url());
        return response.request().method() === "GET" &&
          url.pathname === endpoint && (url.searchParams.get("q") || "") === term.trim();
      }),
      search.fill(term),
    ]);
    expect(response.ok(), `Consulta de ${this.screen.searchResource}: HTTP ${response.status()}`).toBeTruthy();
  }

  getRecordRow(identifier: string) {
    return this.page.locator(this.screen.body).getByRole("row").filter({
      has: this.page.getByRole("cell", { name: identifier, exact: true }),
    });
  }

  async expectRecord(identifier: string, columns: Record<string, string>) {
    const row = this.getRecordRow(identifier);
    await expect(row).toHaveCount(1);
    await expect(row).toBeVisible();

    const table = this.page.locator(this.screen.body).locator("..");
    for (const [column, value] of Object.entries(columns)) {
      const header = table.getByRole("columnheader", { name: column, exact: true });
      await expect(header).toHaveCount(1);
      const index = await header.evaluate((element: HTMLTableCellElement) => element.cellIndex);
      await expect(row.getByRole("cell").nth(index)).toHaveText(value);
    }
  }
}

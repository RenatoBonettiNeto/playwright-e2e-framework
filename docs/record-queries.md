# Consultas após o cadastro

Use `RecordQueryPage` para buscar e conferir o registro na tabela. Use `RecordQueryApi` para consultar o ID criado e validar os dados persistidos, incluindo campos que não aparecem na listagem.

## Telas analisadas no tcc-app

| Cadastro / consulta | Comportamento da tela | Suporte reutilizável |
| --- | --- | --- |
| `employees.html` | Busca por nome, CPF ou e-mail; filtros; tabela paginada; modal de detalhes | `employees` / API `funcionarios` |
| `departments.html` | Busca por nome ou sigla; filtro de status; tabela paginada ou árvore; modal de detalhes | `departments` / API `departamentos`; validação em modo tabela |
| `roles.html` | Busca por nome; filtros de departamento, status e modelo; tabela paginada; modal de detalhes | `roles` / API `cargos` |
| `skills.html` | Busca por nome ou descrição; filtro de status; tabela paginada; formulário de edição | `skills` / API `skills` |
| `vacancy.html` | Tabela administrativa com ID, título, departamento, setor e descrição; sem campo de busca e sem paginação | `vacancies` / API `vagas`; localizar pela célula de ID ou título |
| `job-detail.html` | Lista de vagas para colaboradores, filtro por cargo/interesse, detalhes e candidaturas | Requer Page Object próprio para lista, abas e modais |
| `career-map.html` | Grades de cargos e departamentos ativos | Requer Page Object próprio para cartões |
| `profile.html` | Dados do usuário autenticado, detalhes do funcionário e tabela de documentos | Consulta depende da sessão e do vínculo com funcionário |
| `register.html` | Cadastro de usuário, sem listagem geral de usuários | Validar com o fluxo de autenticação e as consultas específicas de usuário |
| `homepage.html`, `login.html`, `header.html` | Resumo/engajamento, autenticação e navegação | Não são listagens de cadastros |

Os GETs por ID de funcionários, departamentos, cargos e skills retornam `{ data: registro }`. Vagas retorna `{ vaga: registro }`; o helper trata essa diferença explicitamente.

## Exemplo: funcionário

Após capturar o ID na resposta do cadastro:

```ts
const queryApi = new RecordQueryApi("funcionarios");
const saved = await queryApi.expectRecord(request, createdEmployee.id_funcionario, {
  nome_completo: employee.nomeCompleto,
  email_corporativo: employee.emailCorporativo,
  user_id: null,
});

await employeePage.query.search(employee.emailCorporativo);
await employeePage.query.expectRecord(employee.emailCorporativo, {
  "Matrícula": saved.matricula,
  "Nome": employee.nomeCompleto,
  "E-mail corporativo": employee.emailCorporativo,
  "Status": employee.status,
});
```

`EmployeePage`, `DepartmentPage` e `RolePage` expõem o componente em `.query`. Também é possível usá-lo diretamente:

```ts
import { RecordQueryPage } from "../pages/RecordQueryPage";
import { RecordQueryApi } from "../helpers/api/recordQueryApi";

const query = new RecordQueryPage(page, "vacancies");
await query.open();
await query.expectRecord(String(createdVacancy.id_vaga), {
  "ID": String(createdVacancy.id_vaga),
  "Título": vacancy.titulo,
});

const savedVacancy = await new RecordQueryApi("vagas")
  .getById(request, createdVacancy.id_vaga);
```

## Métodos e cuidados de uso

- `open()`: abre a tela configurada; usa `WEB_URL` do Playwright.
- `search(termo)`: usa o campo Busca e aguarda o GET correspondente ao termo. Repetir o mesmo termo mantém a consulta. Vagas não oferece essa operação.
- `getRecordRow(identificador)`: retorna a linha que contém uma célula com texto exato. Use uma informação única, como e-mail corporativo, nome gerado pelo teste ou ID de vaga.
- `expectRecord(identificador, colunas)`: exige uma única linha visível e compara os valores pelos títulos dos cabeçalhos. Coluna inexistente, linha ambígua ou valor incorreto fazem o teste falhar.
- `getById(request, id)`: realiza um GET autenticado usando `API_URL` e retorna o registro; falhas HTTP ou resposta sem registro fazem o teste falhar.
- `expectRecord(request, id, campos)`: consulta novamente a API, compara os campos informados e retorna o registro.

A busca mantém os outros filtros da tela. A validação confere a página atual da tabela; não percorre páginas automaticamente. Use termos únicos para localizar os dados criados pelo teste.

Compare na tabela o texto exibido: departamento com pai pode mostrar ambos na célula Nome; Skills, Cargos e Vagas podem truncar descrições/objetivos. Use a API para comparar o conteúdo completo. Árvore, cartões, modais de detalhes e filtros específicos continuam pertencendo aos Page Objects de cada tela.

Os testes de criação de funcionário, departamento e cargo usam as duas consultas. Os cenários em `tests/queries/recordQuery.spec.ts` preparam skill e vaga pela API para validar as consultas nessas telas; não cobrem seus formulários de cadastro.

```powershell
npx.cmd playwright test tests/employee.spec.ts tests/department.spec.ts tests/role.spec.ts tests/queries/recordQuery.spec.ts --project=chromium --reporter=line
```

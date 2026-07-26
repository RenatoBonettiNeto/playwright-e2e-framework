# Playwright E2E Framework

Projeto desenvolvido para demonstrar uma estrutura profissional de automação de testes End-to-End utilizando Playwright.
A aplicação utilizada como alvo dos testes é um projeto privado desenvolvido durante meu Trabalho de Conclusão de Curso (TCC). Este repositório contém exclusivamente a camada de testes automatizados.
O objetivo é evoluir continuamente este framework, aplicando boas práticas de automação de testes utilizadas em ambientes profissionais de QA, com foco em organização, escalabilidade e manutenção.

## 🚀 Tecnologias

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)
- Fixtures
- API Testing
- HTML Reports

## 🏗️ Arquitetura

O framework foi desenvolvido seguindo o padrão **Page Object Model (POM)**, separando responsabilidades entre páginas, testes, preparação de dados e fixtures.

```text
playwright-e2e-framework
│
├── pages
├── tests
│   └── auth
├── fixtures
├── helpers
│   └── api
├── playwright.config.ts
└── package.json
```

## 🎯 Objetivos

- Desenvolver um framework de automação escalável
- Automatizar fluxos críticos da aplicação
- Aplicar boas práticas de QA
- Implementar Page Object Model (POM)
- Construir testes independentes e reutilizáveis
- Criar suítes de testes Smoke e Regressão
- Evoluir continuamente a arquitetura do framework

## ✅ Cobertura Atual

### 🔐 Autenticação

- Cadastro de recrutadores
- Cadastro de colaboradores
- Login de recrutadores
- Validações de cadastro
- Validações de login
- Regras de negócio da autenticação
- Preparação de dados via API

## 📈 Roadmap

### 🔐 Autenticação

- [x] Cadastro de recrutador
- [x] Cadastro de colaborador
- [x] Login do recrutador
- [ ] Login do colaborador (após aprovação do funcionário)

### 👥 Gestão de Funcionários

- [ ] Aprovação de colaboradores
- [ ] Cadastro de funcionários
- [ ] Atualização de funcionários

### 🏢 Estrutura Organizacional

- [ ] Departamentos
- [ ] Cargos
- [ ] Competências (Skills)

### 💼 Recrutamento

- [ ] Vagas
- [ ] Detalhes da vaga
- [ ] Mapa de carreira

### 👤 Perfil

- [ ] Atualização de perfil

### ⚙️ Framework

- [x] Page Object Model
- [x] BasePage
- [x] API para preparação de dados
- [x] Fixtures reutilizáveis
- [x] Separação dos testes por fluxo (Happy Path, Validation e Business Rules)
- [x] API para preparação de dados
- [ ] Limpeza automática dos dados
- [ ] GitHub Actions
- [ ] Relatórios personalizados

## 📚 Aprendizados

Este projeto faz parte da minha evolução como Analista de Qualidade (QA), explorando automação de testes, arquitetura de testes e boas práticas de desenvolvimento utilizando Playwright.

Além da implementação dos testes, o foco está na construção de um framework reutilizável e escalável, aplicando conceitos como:

- Page Object Model (POM)
- BasePage
- Preparação de dados via API
- Reutilização de Fixtures
- Organização dos testes por fluxo de negócio
- Independência entre cenários de teste

---

# 🇺🇸 English

This project demonstrates a professional end-to-end automation framework built with Playwright.
The application under test is a private web application developed during my university capstone project. Only the automation layer is publicly available.
The goal of this repository is to continuously evolve into a scalable and maintainable automation framework following industry best practices.
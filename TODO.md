# TODO - Itens Pendentes de Implementação

Este documento lista todos os itens que foram removidos ou não puderam ser implementados durante a atualização do projeto conforme o CLAUDE.md.

---

## 🔴 Itens Removidos (Requerem Configuração Adicional)

### 1. Banco de Dados SQLite - Histórico de Execuções

**Motivo da remoção:** A dependência `better-sqlite3` requer compilação nativa com Visual Studio C++ Build Tools, que não está instalado no ambiente.

**Arquivos removidos:**
- `cypress/support/db/sqlite-client.ts` - Cliente SQLite para persistência
- `scripts/db-init.ts` - Script de inicialização do banco

**Funcionalidades perdidas:**
- [ ] Armazenamento de histórico de execuções de testes
- [ ] Catalogação automática de bugs/erros recorrentes
- [ ] Rastreamento de artefatos (screenshots, videos) por execução
- [ ] Views para análise de testes falhados
- [ ] Hash de erros para agrupar falhas similares

**Como implementar:**

1. Instalar Visual Studio Build Tools:
   ```powershell
   # Baixar e instalar Visual Studio Build Tools
   # https://visualstudio.microsoft.com/visual-cpp-build-tools/
   # Selecionar "Desktop development with C++"
   ```

2. Reinstalar dependências:
   ```bash
   npm install better-sqlite3 @types/better-sqlite3
   ```

3. Recriar os arquivos removidos conforme CLAUDE.md (seções 388-615)

4. Atualizar `cypress.config.ts` com os hooks de banco de dados

**Schema do banco (já existe em `db/migrations/init.sql`):**
- `test_runs` - Execuções de teste
- `test_specs` - Specs executados
- `test_cases` - Casos de teste individuais
- `test_artifacts` - Screenshots, videos, logs
- `cataloged_bugs` - Bugs catalogados automaticamente

---

### 2. Integração do Banco com Cypress Config

**Motivo:** Dependente do item 1 (SQLite)

**Funcionalidades pendentes:**
- [ ] Hook `setupNodeEvents` para registrar execuções no banco
- [ ] Task `logTestResult` para salvar resultados de testes
- [ ] Task `logArtifact` para registrar artefatos
- [ ] Task `catalogBug` para catalogar erros
- [ ] Task `generateErrorHash` para criar hash de erros
- [ ] Hook `after:screenshot` para processar e catalogar screenshots de falha
- [ ] Hook `after:spec` para processar videos
- [ ] Hook `after:run` para finalizar execução no banco

---

## ✅ Itens Implementados

### 3. Cypress Grep - Filtro por Tags

**Status:** ✅ IMPLEMENTADO E FUNCIONANDO

**Implementado:**
- [x] Plugin configurado no `cypress.config.ts`
- [x] Suporte registrado no `cypress/support/e2e.ts`
- [x] Todos os testes atualizados com tags no formato `@cypress/grep`
- [x] Comandos de filtro funcionando

**Tags disponíveis:**
- `@smoke` - Testes de smoke (6 testes)
- `@regression` - Testes de regressão (12 testes)
- `@api` - Testes de API (5 testes)
- `@e2e` - Testes E2E (13 testes)
- `@qa-core` - Squad QA Core
- `@qa-frontend` - Squad QA Frontend
- `@qa-api` - Squad QA API
- `@critical`, `@high`, `@medium` - Prioridades
- `@search`, `@stories`, `@errors` - Módulos
- `@sorting`, `@pagination`, `@error-handling` - Funcionalidades específicas

**Comandos disponíveis:**
```bash
# Executar apenas testes smoke
npm run cy:run:smoke
# ou
npx cypress run --env grepTags=@smoke

# Executar apenas testes de regressão
npm run cy:run:regression
# ou
npx cypress run --env grepTags=@regression

# Executar testes de API
npx cypress run --env grepTags=@api

# Executar testes de um squad específico
npm run cy:run:squad:core
# ou
npx cypress run --env grepTags=@qa-core

# Combinar tags (AND)
npx cypress run --env grepTags="@smoke+@api"

# Múltiplas tags (OR)
npx cypress run --env grepTags="@smoke @regression"

# Excluir tags
npx cypress run --env grepTags="-@regression"
```

---

## 🟡 Itens Parcialmente Implementados

### 4. Organização de Artefatos por Run ID

**Status:** Estrutura criada, mas sem persistência no banco

**Implementado:**
- [x] Geração de `runId` único por execução
- [x] Criação de diretórios organizados por `runId`
- [x] Hook `after:screenshot` para renomear screenshots

**Pendente:**
- [ ] Persistência do mapeamento no banco SQLite
- [ ] Limpeza automática de artefatos antigos (`scripts/cleanup-artifacts.ts`)

---

### 5. Video Recording

**Status:** Configurado mas desabilitado no ambiente atual

**Configuração atual em `cypress.config.ts`:**
```typescript
video: true,
videoCompression: 32,
```

**Nota:** Videos estão configurados para serem gravados, mas o relatório mostra `Video: false`. Verificar se há conflito com configuração do reporter.

---

### 6. Testes E2E com Mock (hackerStoriesMock)

**Status:** Pasta antiga removida, novos testes usam API real

**Removido:**
- `cypress/e2e/hackerStoriesMock/` - Todos os testes com fixtures

**Motivo:** Os testes foram migrados para usar a API real. Se necessário testes com mock, criar nova estrutura em `cypress/e2e/*/` usando o comando `cy.interceptStories({ fixture: '...' })`.

**Pendente:**
- [ ] Decidir se testes com mock são necessários
- [ ] Se sim, criar specs separados com sufixo `.mock.cy.ts`

---

## 🟢 Itens para Melhorias Futuras

### 7. ESLint com Parser TypeScript

**Status:** Configurado mas pode gerar warnings

**Pendente:**
- [ ] Resolver warnings de `parserOptions.project`
- [ ] Configurar regras específicas para arquivos de teste

---

### 8. Relatório Customizado

**Status:** Usando apenas Mochawesome

**Pendente conforme CLAUDE.md:**
- [ ] Implementar `cypress/report-template/report-generator.js`
- [ ] Implementar `cypress/report-template/theme.config.js`
- [ ] Implementar `cypress/report-template/history-manager.js`
- [ ] Implementar `cypress/report-template/extract-tags.js`
- [ ] Implementar `cypress/report-template/copy-assets.js`
- [ ] Implementar `cypress/report-template/execution-config.js`

---

### 9. Seletores com data-testid

**Status:** Usando seletores CSS e `:contains()`

**Atual:**
```typescript
submitButton: 'button:contains("Submit")',
moreButton: 'button:contains("More")',
```

**Recomendado (requer alteração na aplicação):**
```typescript
submitButton: '[data-testid="submit-button"]',
moreButton: '[data-testid="more-button"]',
```

**Pendente:**
- [ ] Solicitar adição de `data-testid` na aplicação Hacker Stories
- [ ] Atualizar seletores quando disponíveis

---

### 10. Scripts de Banco de Dados

**Pendente:**
- [ ] `scripts/db-init.ts` - Inicialização do banco
- [ ] `scripts/generate-report.ts` - Geração de relatório do banco
- [ ] `scripts/cleanup-artifacts.ts` - Limpeza de artefatos antigos

---

## 📋 Checklist de Implementação Completa

### Infraestrutura
- [x] TypeScript configurado
- [x] ESLint configurado
- [x] Prettier configurado
- [x] EditorConfig configurado
- [ ] SQLite configurado
- [x] Mochawesome configurado
- [x] Cypress Grep configurado ✅

### Testes
- [x] Testes E2E de Search
- [x] Testes E2E de Stories
- [x] Testes E2E de Errors
- [x] Testes de API
- [ ] Testes com Mock (opcional)

### Relatórios
- [x] Mochawesome HTML
- [x] Merge de relatórios JSON
- [ ] Relatório customizado
- [ ] Histórico de execuções (banco)

### CI/CD
- [ ] GitHub Actions workflow
- [ ] Integração com CI_BUILD_ID, CI_BRANCH, CI_COMMIT

---

## 🛠️ Comandos para Implementação

```bash
# 1. Instalar Visual Studio Build Tools (necessário para SQLite)
# Baixar de: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# 2. Após instalar Build Tools, adicionar SQLite
npm install better-sqlite3 @types/better-sqlite3

# 3. Inicializar banco de dados
npm run db:init

# 4. Verificar se tudo funciona
npm run cy:all
```

---

## 📅 Última Atualização

**Data:** 2026-01-23
**Versão Cypress:** 15.9.0
**Status:** 18/18 testes passando

### Histórico de Alterações
- **2026-01-23:** Cypress Grep implementado e funcionando com filtro por tags

#!/usr/bin/env ts-node

/**
 * Script de execucao de testes Cypress com geracao de relatorios
 *
 * Uso:
 *   npx ts-node scripts/run-tests.ts [opcoes]
 *
 * Opcoes:
 *   --spec <pattern>    Executar apenas specs especificos (ex: "cypress/e2e/**/*.cy.ts")
 *   --browser <name>    Navegador a usar (chrome, firefox, electron)
 *   --headed            Executar com interface grafica
 *   --env <vars>        Variaveis de ambiente (ex: "grepTags=smoke")
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const RESULTS_DIR = path.join(__dirname, '..', 'cypress', 'results');
const JSON_DIR = path.join(RESULTS_DIR, 'json');
const MOCHAWESOME_DIR = path.join(RESULTS_DIR, 'mochawesome');

function log(message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function cleanupDirectories(): void {
  log('Limpando diretorios de resultados anteriores...');

  const dirsToClean = [
    path.join(__dirname, '..', 'cypress', 'screenshots'),
    RESULTS_DIR,
  ];

  dirsToClean.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      log(`  Removido: ${dir}`);
    }
  });

  // Recria diretorios necessarios
  fs.mkdirSync(JSON_DIR, { recursive: true });
  fs.mkdirSync(MOCHAWESOME_DIR, { recursive: true });
  log('Diretorios recriados.');
}

function runCypressTests(args: string[]): boolean {
  log('Iniciando execucao dos testes Cypress...');

  const cypressArgs = ['run', ...args];

  try {
    execSync(`npx cypress ${cypressArgs.join(' ')}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    log('Testes concluidos com sucesso!');
    return true;
  } catch (error) {
    log('Alguns testes falharam.');
    return false;
  }
}

function mergeReports(): boolean {
  log('Mesclando relatorios JSON...');

  const jsonFiles = path.join(JSON_DIR, '*.json');
  const outputFile = path.join(RESULTS_DIR, 'output.json');

  try {
    execSync(`npx mochawesome-merge "${jsonFiles}" > "${outputFile}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      shell: 'powershell.exe',
    });
    log(`Relatorios mesclados em: ${outputFile}`);
    return true;
  } catch (error) {
    log('Erro ao mesclar relatorios.');
    console.error(error);
    return false;
  }
}

function generateHtmlReport(): boolean {
  log('Gerando relatorio HTML...');

  const inputFile = path.join(RESULTS_DIR, 'output.json');

  try {
    execSync(
      `npx marge "${inputFile}" --reportDir "${MOCHAWESOME_DIR}" --inline --charts true`,
      {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      }
    );
    log(`Relatorio HTML gerado em: ${MOCHAWESOME_DIR}`);
    return true;
  } catch (error) {
    log('Erro ao gerar relatorio HTML.');
    console.error(error);
    return false;
  }
}

function openReport(): void {
  const reportPath = path.join(MOCHAWESOME_DIR, 'mochawesome.html');

  if (fs.existsSync(reportPath)) {
    log(`Abrindo relatorio: ${reportPath}`);
    try {
      execSync(`start "" "${reportPath}"`, {
        cwd: path.join(__dirname, '..'),
        shell: 'cmd.exe',
      });
    } catch (error) {
      log(`Relatorio disponivel em: ${reportPath}`);
    }
  } else {
    log('Relatorio nao encontrado.');
  }
}

function printSummary(testsSuccess: boolean): void {
  console.log('\n' + '='.repeat(60));
  console.log('RESUMO DA EXECUCAO');
  console.log('='.repeat(60));
  console.log(`Status dos testes: ${testsSuccess ? 'PASSOU' : 'FALHOU'}`);
  console.log(`Relatorio: ${path.join(MOCHAWESOME_DIR, 'mochawesome.html')}`);
  console.log('='.repeat(60) + '\n');
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  console.log('\n' + '='.repeat(60));
  console.log('CYPRESS TEST RUNNER');
  console.log('='.repeat(60) + '\n');

  // 1. Cleanup
  cleanupDirectories();

  // 2. Run tests
  const testsSuccess = runCypressTests(args);

  // 3. Merge reports
  const mergeSuccess = mergeReports();

  // 4. Generate HTML report
  if (mergeSuccess) {
    generateHtmlReport();
  }

  // 5. Print summary
  printSummary(testsSuccess);

  // 6. Open report
  openReport();

  // Exit with appropriate code
  process.exit(testsSuccess ? 0 : 1);
}

main();

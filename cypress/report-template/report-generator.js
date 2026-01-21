/**
 * Custom Report Generator for Cypress Tests
 * Uses Tailwind CSS for styling with full customization support
 * Features: Interactive charts, detailed test view, error formatting, i18n, history, tags
 */

const fs = require('fs');
const path = require('path');

// Load configurations
let themeConfig;
let executionConfig;

try {
  themeConfig = require('./theme.config.js');
} catch (e) {
  themeConfig = getDefaultTheme();
}

try {
  executionConfig = require('./execution-config.js');
} catch (e) {
  executionConfig = getDefaultExecutionConfig();
}

const HistoryManager = require('./history-manager.js');

function getDefaultTheme() {
  return {
    branding: { name: 'Test Report' },
    fonts: {
      googleFonts: ['Inter:wght@300;400;500;600;700;800', 'JetBrains+Mono:wght@400;500'],
      families: { sans: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" },
    },
    colors: {
      primary: { 500: '#6366f1', 600: '#4f46e5' },
      success: { 500: '#10b981' },
      danger: { 500: '#ef4444' },
      warning: { 500: '#f59e0b' },
      info: { 500: '#3b82f6' },
    },
  };
}

function getDefaultExecutionConfig() {
  return {
    squads: [{ id: 'qa-core', name: 'QA Core' }],
    executionTypes: [{ id: 'regression', name: 'Regressivo' }],
    products: [{ id: 'default', name: 'Default' }],
    modules: [{ id: 'general', name: 'Geral' }],
    functionalities: [
      { id: 'e2e', name: 'E2E' },
      { id: 'api', name: 'API' },
    ],
    defaults: {
      squad: 'qa-core',
      executionType: 'regression',
      product: 'default',
      module: 'general',
      functionality: 'e2e',
    },
  };
}

// Translations - PT-BR is default
const translations = {
  'pt-BR': {
    testReport: 'Relatorio de Testes',
    dashboard: 'Painel',
    testResults: 'Resultados dos Testes',
    coverage: 'Cobertura',
    history: 'Historico',
    executionSummary: 'Resumo da Execucao e Analises',
    totalTests: 'Total de Testes',
    passed: 'Passou',
    failed: 'Falhou',
    skipped: 'Ignorado',
    pending: 'Pendente',
    passRate: 'Taxa de Sucesso',
    testResultsDistribution: 'Distribuicao dos Resultados',
    testTypeDistribution: 'Distribuicao por Tipo de Teste',
    clickForDetails: 'Clique para ver detalhes',
    clickBarsForDetails: 'Clique nas barras para detalhes',
    executionMetrics: 'Metricas de Execucao',
    totalDuration: 'Duracao Total',
    avgPerTest: 'Media por Teste',
    testSuites: 'Suites de Teste',
    healthStatus: 'Status de Saude',
    excellent: 'Excelente',
    good: 'Bom',
    needsWork: 'Precisa Melhorar',
    showingAllTests: 'Mostrando todos os testes',
    showingTests: 'Mostrando testes {status}',
    all: 'Todos',
    featureCoverage: 'Cobertura por Funcionalidade',
    testDetails: 'Detalhes do Teste',
    testPath: 'Caminho do Teste',
    fullTitle: 'Titulo Completo',
    duration: 'Duracao',
    speed: 'Velocidade',
    status: 'Status',
    file: 'Arquivo',
    errorMessage: 'Mensagem de Erro',
    stackTrace: 'Stack Trace',
    actual: 'Atual',
    expected: 'Esperado',
    diff: 'Diferenca',
    testCode: 'Codigo do Teste',
    screenshot: 'Captura de Tela',
    export: 'Exportar',
    theme: 'Tema',
    language: 'Idioma',
    e2eTests: 'Testes E2E',
    mockTests: 'Testes Mock',
    integration: 'Integracao',
    unit: 'Unitario',
    total: 'total',
    noTestsFound: 'Nenhum teste encontrado',
    noCoverageData: 'Sem dados de cobertura',
    // Tags & Metadata
    executionTags: 'Tags da Execucao',
    squad: 'Squad/Time',
    executionType: 'Tipo de Execucao',
    executionDate: 'Data da Execucao',
    product: 'Produto',
    module: 'Modulo',
    functionality: 'Funcionalidade',
    selectSquad: 'Selecione a Squad',
    selectType: 'Selecione o Tipo',
    selectProduct: 'Selecione o Produto',
    selectModule: 'Selecione o Modulo',
    selectFunctionality: 'Selecione a Funcionalidade',
    // History
    executionHistory: 'Historico de Execucoes',
    viewHistory: 'Ver Historico',
    selectDate: 'Selecionar Data',
    today: 'Hoje',
    noHistoryData: 'Nenhum historico disponivel',
    lastExecution: 'Ultima Execucao',
    // Date picker
    dateFormat: 'DD/MM/AAAA',
    pickDate: 'Escolher Data',
    // Execution types
    release: 'Release',
    regression: 'Regressivo',
    smoke: 'Smoke',
    sanity: 'Sanity',
    exploratory: 'Exploratorio',
  },
  en: {
    testReport: 'Test Report',
    dashboard: 'Dashboard',
    testResults: 'Test Results',
    coverage: 'Coverage',
    history: 'History',
    executionSummary: 'Execution Summary & Analytics',
    totalTests: 'Total Tests',
    passed: 'Passed',
    failed: 'Failed',
    skipped: 'Skipped',
    pending: 'Pending',
    passRate: 'Pass Rate',
    testResultsDistribution: 'Test Results Distribution',
    testTypeDistribution: 'Test Type Distribution',
    clickForDetails: 'Click segments for details',
    clickBarsForDetails: 'Click bars for details',
    executionMetrics: 'Execution Metrics',
    totalDuration: 'Total Duration',
    avgPerTest: 'Avg. per Test',
    testSuites: 'Test Suites',
    healthStatus: 'Health Status',
    excellent: 'Excellent',
    good: 'Good',
    needsWork: 'Needs Work',
    showingAllTests: 'Showing all tests',
    showingTests: 'Showing {status} tests',
    all: 'All',
    featureCoverage: 'Feature Coverage',
    testDetails: 'Test Details',
    testPath: 'Test Path',
    fullTitle: 'Full Title',
    duration: 'Duration',
    speed: 'Speed',
    status: 'Status',
    file: 'File',
    errorMessage: 'Error Message',
    stackTrace: 'Stack Trace',
    actual: 'Actual',
    expected: 'Expected',
    diff: 'Diff',
    testCode: 'Test Code',
    screenshot: 'Screenshot',
    export: 'Export',
    theme: 'Theme',
    language: 'Language',
    e2eTests: 'E2E Tests',
    mockTests: 'Mock Tests',
    integration: 'Integration',
    unit: 'Unit',
    total: 'total',
    noTestsFound: 'No tests found',
    noCoverageData: 'No coverage data',
    // Tags & Metadata
    executionTags: 'Execution Tags',
    squad: 'Squad/Team',
    executionType: 'Execution Type',
    executionDate: 'Execution Date',
    product: 'Product',
    module: 'Module',
    functionality: 'Functionality',
    selectSquad: 'Select Squad',
    selectType: 'Select Type',
    selectProduct: 'Select Product',
    selectModule: 'Select Module',
    selectFunctionality: 'Select Functionality',
    // History
    executionHistory: 'Execution History',
    viewHistory: 'View History',
    selectDate: 'Select Date',
    today: 'Today',
    noHistoryData: 'No history available',
    lastExecution: 'Last Execution',
    // Date picker
    dateFormat: 'DD/MM/YYYY',
    pickDate: 'Pick Date',
    // Execution types
    release: 'Release',
    regression: 'Regression',
    smoke: 'Smoke',
    sanity: 'Sanity',
    exploratory: 'Exploratory',
  },
};

class ReportGenerator {
  constructor(options = {}) {
    this.inputFile = options.inputFile || 'cypress/results/output.json';
    this.outputDir = options.outputDir || 'cypress/results/report';
    this.projectName = options.projectName || themeConfig.branding?.name || 'Test Report';
    this.theme = options.theme || 'dark';
    this.config = themeConfig;
    this.execConfig = executionConfig;
    this.testIndex = 0;
    this.historyManager = new HistoryManager();

    // Parse tags from command line
    this.tags = this.parseTags(options);
  }

  parseTags(options) {
    return {
      squad: options.squad || process.env.CYPRESS_SQUAD || this.execConfig.defaults.squad,
      executionType: options.executionType || process.env.CYPRESS_EXEC_TYPE || this.execConfig.defaults.executionType,
      product: options.product || process.env.CYPRESS_PRODUCT || this.execConfig.defaults.product,
      module: options.module || process.env.CYPRESS_MODULE || this.execConfig.defaults.module,
      functionality: options.functionality || process.env.CYPRESS_FUNCTIONALITY || this.execConfig.defaults.functionality,
      date: options.date || process.env.CYPRESS_EXEC_DATE || new Date().toISOString(),
    };
  }

  generate() {
    console.log('🚀 Generating custom test report with Tailwind CSS...');

    const reportData = this.loadReportData();
    if (!reportData) {
      console.error('❌ Failed to load report data');
      return;
    }

    // Extract all suites from ALL results (multiple spec files)
    const allSuites = this.extractAllSuites(reportData.results || []);
    const allTests = this.extractAllTests(allSuites);
    const metrics = this.calculateMetrics(reportData, allTests);

    // Save to history
    this.historyManager.saveExecution({
      date: this.tags.date,
      tags: this.tags,
      total: metrics.totalTests,
      passed: metrics.passed,
      failed: metrics.failed,
      skipped: metrics.pending,
      passRate: parseFloat(metrics.passRate),
      duration: metrics.duration,
      tests: allTests,
      suites: allSuites,
    });

    // Get history data
    const historyData = this.historyManager.getAllExecutions();

    const html = this.generateHTML(reportData, metrics, allTests, allSuites, historyData);

    this.ensureOutputDir();
    this.writeReport(html);

    console.log(`✅ Report generated successfully at: ${this.outputDir}/index.html`);
    console.log(`   Total tests found: ${allTests.length}`);
  }

  loadReportData() {
    try {
      const rawData = fs.readFileSync(this.inputFile, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error(`Error loading report data: ${error.message}`);
      return null;
    }
  }

  extractAllSuites(results) {
    const allSuites = [];

    results.forEach((result) => {
      const file = result.file || result.fullFile || '';

      const processSuites = (suites, parentFile) => {
        suites.forEach((suite) => {
          const suiteWithFile = { ...suite, file: parentFile || file };
          allSuites.push(suiteWithFile);
        });
      };

      if (result.suites && result.suites.length > 0) {
        processSuites(result.suites, file);
      }
    });

    return allSuites;
  }

  extractAllTests(suites) {
    const tests = [];
    this.testIndex = 0;

    const processSuite = (suite, parentPath = [], parentFile = '') => {
      const currentPath = suite.title ? [...parentPath, suite.title] : parentPath;
      const file = suite.file || parentFile;

      (suite.tests || []).forEach((test) => {
        tests.push({
          id: `test-${this.testIndex++}`,
          title: test.title,
          fullTitle: test.fullTitle || [...currentPath, test.title].join(' > '),
          suitePath: currentPath,
          status: test.pass ? 'passed' : test.fail ? 'failed' : 'pending',
          duration: test.duration || 0,
          speed: test.speed || 'fast',
          code: test.code || '',
          err: test.err && Object.keys(test.err).length > 0 ? test.err : null,
          context: test.context || null,
          file: file,
          uuid: test.uuid || '',
        });
      });

      (suite.suites || []).forEach((nestedSuite) => {
        processSuite(nestedSuite, currentPath, file);
      });
    };

    suites.forEach((suite) => processSuite(suite));
    return tests;
  }

  calculateMetrics(data, allTests) {
    const stats = data.stats || {};

    const totalTests = allTests.length;
    const passed = allTests.filter((t) => t.status === 'passed').length;
    const failed = allTests.filter((t) => t.status === 'failed').length;
    const pending = allTests.filter((t) => t.status === 'pending').length;
    const duration = stats.duration || 0;

    const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;
    const failRate = totalTests > 0 ? ((failed / totalTests) * 100).toFixed(1) : 0;

    const featureCoverage = this.calculateFeatureCoverage(allTests);
    const testDistribution = this.calculateTestDistribution(allTests);

    return {
      totalTests,
      passed,
      failed,
      pending,
      skipped: 0,
      duration,
      passRate,
      failRate,
      featureCoverage,
      testDistribution,
      startTime: stats.start || new Date().toISOString(),
      endTime: stats.end || new Date().toISOString(),
    };
  }

  calculateFeatureCoverage(allTests) {
    const features = {};

    allTests.forEach((test) => {
      const featureName = test.suitePath[0] || 'Unknown';

      if (!features[featureName]) {
        features[featureName] = { passed: 0, failed: 0, pending: 0, total: 0 };
      }

      features[featureName].total++;
      if (test.status === 'passed') features[featureName].passed++;
      if (test.status === 'failed') features[featureName].failed++;
      if (test.status === 'pending') features[featureName].pending++;
    });

    return features;
  }

  calculateTestDistribution(allTests) {
    const distribution = { unit: 0, integration: 0, e2e: 0, mock: 0 };

    allTests.forEach((test) => {
      const file = (test.file || '').toLowerCase();
      if (file.includes('mock')) {
        distribution.mock++;
      } else if (file.includes('api')) {
        distribution.integration++;
      } else {
        distribution.e2e++;
      }
    });

    return distribution;
  }

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }

  formatDateBR(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getGoogleFontsUrl() {
    const fonts = this.config.fonts?.googleFonts || ['Inter:wght@400;500;600;700'];
    return `https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${f}`).join('&')}&display=swap`;
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  getTagLabel(type, id) {
    const lists = {
      squad: this.execConfig.squads,
      executionType: this.execConfig.executionTypes,
      product: this.execConfig.products,
      module: this.execConfig.modules,
      functionality: this.execConfig.functionalities,
    };
    const list = lists[type] || [];
    const item = list.find((i) => i.id === id);
    return item ? item.name : id;
  }

  generateTestList(allTests) {
    return allTests
      .map(
        (test) => `
      <div class="test-item flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer" data-status="${test.status}" data-test-id="${test.id}" onclick="showTestDetail('${test.id}')">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center ${test.status === 'passed' ? 'bg-success-500/10' : test.status === 'failed' ? 'bg-danger-500/10' : 'bg-warning-500/10'}">
          <svg class="w-5 h-5 ${test.status === 'passed' ? 'text-success-500' : test.status === 'failed' ? 'text-danger-500' : 'text-warning-500'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${test.status === 'passed' ? '<polyline points="20,6 9,17 4,12"/>' : test.status === 'failed' ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' : '<line x1="8" y1="12" x2="16" y2="12"/>'}
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-slate-900 dark:text-white truncate">${this.escapeHtml(test.title)}</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 truncate">${this.escapeHtml(test.suitePath.join(' > '))}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-500 dark:text-slate-400 font-mono">${this.formatDuration(test.duration)}</span>
          <svg class="w-5 h-5 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
        </div>
      </div>
    `
      )
      .join('');
  }

  generateFeatureCoverageCards(featureCoverage) {
    return Object.entries(featureCoverage)
      .map(
        ([name, data]) => `
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-slate-900 dark:text-white">${this.escapeHtml(name)}</h4>
          <span class="text-sm text-slate-500">${data.total} <span data-i18n="total">total</span></span>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-success-500 rounded-full" style="width: ${data.total > 0 ? (data.passed / data.total) * 100 : 0}%"></div>
            </div>
            <span class="text-xs text-success-500 font-medium w-8">${data.passed}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-danger-500 rounded-full" style="width: ${data.total > 0 ? (data.failed / data.total) * 100 : 0}%"></div>
            </div>
            <span class="text-xs text-danger-500 font-medium w-8">${data.failed}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-warning-500 rounded-full" style="width: ${data.total > 0 ? (data.pending / data.total) * 100 : 0}%"></div>
            </div>
            <span class="text-xs text-warning-500 font-medium w-8">${data.pending}</span>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  }

  generateHistoryList(historyData) {
    if (!historyData || historyData.length === 0) {
      return '<div class="text-center py-8 text-slate-500" data-i18n="noHistoryData">Nenhum historico disponivel</div>';
    }

    return historyData
      .map(
        (exec, index) => `
      <div class="history-item flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer ${index === 0 ? 'ring-2 ring-primary-500' : ''}" onclick="loadHistoryExecution('${exec.date}')">
        <div class="w-12 h-12 rounded-xl ${exec.summary.passRate >= 90 ? 'bg-success-500/10' : exec.summary.passRate >= 70 ? 'bg-warning-500/10' : 'bg-danger-500/10'} flex items-center justify-center">
          <span class="text-lg font-bold ${exec.summary.passRate >= 90 ? 'text-success-500' : exec.summary.passRate >= 70 ? 'text-warning-500' : 'text-danger-500'}">${exec.summary.passRate}%</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-900 dark:text-white">${exec.date}</span>
            ${index === 0 ? '<span class="px-2 py-0.5 text-xs font-bold bg-primary-500/10 text-primary-500 rounded-full" data-i18n="today">Hoje</span>' : ''}
          </div>
          <div class="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-success-500"></span>${exec.summary.passed}</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-danger-500"></span>${exec.summary.failed}</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-warning-500"></span>${exec.summary.skipped}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-sm text-slate-500">${exec.summary.total} testes</span>
          ${exec.tags?.squad ? `<span class="block text-xs text-slate-400 mt-1">${this.getTagLabel('squad', exec.tags.squad)}</span>` : ''}
        </div>
        <svg class="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
      </div>
    `
      )
      .join('');
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  writeReport(html) {
    const outputPath = path.join(this.outputDir, 'index.html');
    fs.writeFileSync(outputPath, html);
  }

  generateHTML(data, metrics, allTests, allSuites, historyData) {
    const colors = this.config.colors || {};
    const testsJson = JSON.stringify(allTests).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const translationsJson = JSON.stringify(translations);
    const historyJson = JSON.stringify(historyData || []);
    const execConfigJson = JSON.stringify(this.execConfig);
    const currentTagsJson = JSON.stringify(this.tags);
    const currentDate = this.formatDateBR(this.tags.date);

    return `<!DOCTYPE html>
<html lang="pt-BR" class="${this.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.projectName} - Relatorio de Testes</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${this.getGoogleFontsUrl()}" rel="stylesheet">

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: ${JSON.stringify(colors.primary || { 500: '#6366f1', 600: '#4f46e5' })},
            secondary: ${JSON.stringify(colors.secondary || { 500: '#d946ef', 600: '#c026d3' })},
            success: ${JSON.stringify(colors.success || { 500: '#10b981', 600: '#059669' })},
            danger: ${JSON.stringify(colors.danger || { 500: '#ef4444', 600: '#dc2626' })},
            warning: ${JSON.stringify(colors.warning || { 500: '#f59e0b', 600: '#d97706' })},
            info: ${JSON.stringify(colors.info || { 500: '#3b82f6', 600: '#2563eb' })},
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
        },
      },
    }
  </script>

  <style>
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    .gradient-text { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3); }
    .progress-ring-circle { transition: stroke-dashoffset 1s ease-out; transform: rotate(-90deg); transform-origin: 50% 50%; }
    .chart-container { position: relative; height: 280px; }
    #resultsChart, #coverageChart { cursor: pointer; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .tag-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
    .dark input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8); }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">

  <script>
    // Store data
    window.allTests = JSON.parse('${testsJson}');
    window.translations = ${translationsJson};
    window.historyData = ${historyJson};
    window.execConfig = ${execConfigJson};
    window.currentTags = ${currentTagsJson};
    window.currentLang = localStorage.getItem('lang') || 'pt-BR'; // Default PT-BR

    function t(key) {
      return window.translations[window.currentLang]?.[key] || window.translations['pt-BR'][key] || key;
    }
  </script>

  <div class="flex min-h-screen">

    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-50">

      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white">${this.projectName}</h1>
            <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-primary-500/10 text-primary-500 rounded-full" data-i18n="testReport">Relatorio de Testes</span>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <a href="#dashboard" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group active" data-section="dashboard">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="dashboard">Painel</span>
        </a>

        <a href="#tests" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group" data-section="tests">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="testResults">Resultados dos Testes</span>
        </a>

        <a href="#coverage" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group" data-section="coverage">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="coverage">Cobertura</span>
        </a>

        <a href="#history" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group" data-section="history">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="history">Historico</span>
        </a>
      </nav>

      <div class="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <!-- Theme Toggle -->
        <button onclick="toggleTheme()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
          <svg class="w-5 h-5 hidden dark:block text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg class="w-5 h-5 block dark:hidden text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300" data-i18n="theme">Tema</span>
        </button>

        <!-- Language Toggle -->
        <button onclick="toggleLanguage()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
          <svg class="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300" data-i18n="language">Idioma</span>
          <span id="current-lang" class="ml-auto text-xs font-bold text-primary-500 uppercase">PT</span>
        </button>

        <div class="flex items-center justify-between pt-2">
          <span class="text-xs text-slate-400">v2.3.0</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-72 p-8">

      <!-- Tags Section (Always visible at top) -->
      <div class="mb-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-300" data-i18n="executionTags">Tags da Execucao:</span>

          <!-- Squad Tag -->
          <span class="tag-badge bg-primary-500/10 text-primary-600 dark:text-primary-400">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            ${this.getTagLabel('squad', this.tags.squad)}
          </span>

          <!-- Execution Type Tag -->
          <span class="tag-badge bg-secondary-500/10 text-secondary-600 dark:text-secondary-400">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            ${this.getTagLabel('executionType', this.tags.executionType)}
          </span>

          <!-- Product Tag -->
          <span class="tag-badge bg-info-500/10 text-info-600 dark:text-info-400">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            ${this.getTagLabel('product', this.tags.product)}
          </span>

          <!-- Module Tag -->
          <span class="tag-badge bg-warning-500/10 text-warning-600 dark:text-warning-400">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
            ${this.getTagLabel('module', this.tags.module)}
          </span>

          <!-- Functionality Tag -->
          <span class="tag-badge bg-success-500/10 text-success-600 dark:text-success-400">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            ${this.getTagLabel('functionality', this.tags.functionality)}
          </span>

          <!-- Date Selector -->
          <div class="ml-auto flex items-center gap-2">
            <div class="relative">
              <input type="text" id="date-input" value="${currentDate}"
                class="w-32 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center font-mono"
                placeholder="DD/MM/AAAA" maxlength="10" onclick="this.select()" onchange="onDateInputChange(this.value)">
            </div>
            <input type="date" id="date-picker" class="w-10 h-8 opacity-0 absolute" onchange="onDatePickerChange(this.value)">
            <button onclick="document.getElementById('date-picker').showPicker()" class="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all" title="Escolher data">
              <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="breadcrumb" class="hidden mb-4">
        <nav class="flex items-center gap-2 text-sm">
          <button onclick="navigateTo('dashboard')" class="text-primary-500 hover:text-primary-600 font-medium" data-i18n="dashboard">Painel</button>
          <span class="text-slate-400">/</span>
          <span id="breadcrumb-current" class="text-slate-600 dark:text-slate-300"></span>
        </nav>
      </div>

      <header class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 id="page-title" class="text-3xl font-bold gradient-text" data-i18n="dashboard">Painel</h2>
          <p id="page-subtitle" class="text-slate-500 dark:text-slate-400 mt-1" data-i18n="executionSummary">Resumo da Execucao e Analises</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg class="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <span class="font-mono">${this.formatDuration(metrics.duration)}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg class="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>${currentDate} ${new Date(metrics.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <button onclick="exportReport()" class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-lg">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span data-i18n="export">Exportar</span>
          </button>
        </div>
      </header>

      <!-- Dashboard Section -->
      <section id="dashboard" class="section space-y-8">

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div onclick="showTestsByStatus('all')" class="cursor-pointer hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in" style="animation-delay: 0.1s">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-info-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-info-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-info-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.totalTests}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="totalTests">Total de Testes</span>
              </div>
              <svg class="w-5 h-5 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
            </div>
          </div>

          <div onclick="showTestsByStatus('passed')" class="cursor-pointer hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in" style="animation-delay: 0.2s">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-success-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-success-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-success-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.passed}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="passed">Passou</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-500/10 text-success-500">${metrics.passRate}%</span>
                <svg class="w-5 h-5 text-slate-300 dark:text-slate-600 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </div>
            </div>
          </div>

          <div onclick="showTestsByStatus('failed')" class="cursor-pointer hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in" style="animation-delay: 0.3s">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-danger-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-danger-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-danger-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.failed}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="failed">Falhou</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${metrics.failed > 0 ? 'bg-danger-500/10 text-danger-500' : 'bg-success-500/10 text-success-500'}">${metrics.failRate}%</span>
                <svg class="w-5 h-5 text-slate-300 dark:text-slate-600 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </div>
            </div>
          </div>

          <div onclick="showTestsByStatus('pending')" class="cursor-pointer hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in" style="animation-delay: 0.4s">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-warning-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-warning-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-warning-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.pending}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="skipped">Ignorado</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-500/10 text-warning-500">${metrics.totalTests > 0 ? ((metrics.pending / metrics.totalTests) * 100).toFixed(1) : 0}%</span>
                <svg class="w-5 h-5 text-slate-300 dark:text-slate-600 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in" style="animation-delay: 0.3s">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white" data-i18n="testResultsDistribution">Distribuicao dos Resultados</h3>
              <span class="text-xs text-slate-400" data-i18n="clickForDetails">Clique para ver detalhes</span>
            </div>
            <div class="p-6">
              <div class="chart-container"><canvas id="resultsChart"></canvas></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in" style="animation-delay: 0.4s">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white" data-i18n="testTypeDistribution">Distribuicao por Tipo de Teste</h3>
              <span class="text-xs text-slate-400" data-i18n="clickBarsForDetails">Clique nas barras para detalhes</span>
            </div>
            <div class="p-6">
              <div class="chart-container"><canvas id="coverageChart"></canvas></div>
            </div>
          </div>
        </div>

        <!-- Progress & Metrics Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center animate-fade-in" style="animation-delay: 0.4s">
            <div class="relative w-40 h-40 mb-6">
              <svg class="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" class="text-slate-200 dark:text-slate-700"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="url(#progressGradient)" stroke-width="8" stroke-linecap="round" class="progress-ring-circle" stroke-dasharray="339.292" stroke-dashoffset="${339.292 - (339.292 * metrics.passRate) / 100}"/>
                <defs><linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#34d399"/></linearGradient></defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-bold gradient-text">${metrics.passRate}%</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="passRate">Taxa de Sucesso</span>
              </div>
            </div>
            <div class="w-full space-y-3">
              <button onclick="showTestsByStatus('passed')" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <span class="w-3 h-3 rounded-full bg-success-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 text-left"><span data-i18n="passed">Passou</span>: ${metrics.passed}</span>
                <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
              <button onclick="showTestsByStatus('failed')" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <span class="w-3 h-3 rounded-full bg-danger-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 text-left"><span data-i18n="failed">Falhou</span>: ${metrics.failed}</span>
                <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
              <button onclick="showTestsByStatus('pending')" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <span class="w-3 h-3 rounded-full bg-warning-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 text-left"><span data-i18n="skipped">Ignorado</span>: ${metrics.pending}</span>
                <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
            </div>
          </div>

          <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 animate-fade-in" style="animation-delay: 0.5s">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6" data-i18n="executionMetrics">Metricas de Execucao</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${this.formatDuration(metrics.duration)}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="totalDuration">Duracao Total</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${metrics.totalTests > 0 ? this.formatDuration(metrics.duration / metrics.totalTests) : '0ms'}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="avgPerTest">Media por Teste</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${Object.keys(metrics.featureCoverage).length}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="testSuites">Suites de Teste</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold ${metrics.passRate >= 90 ? 'text-success-500' : metrics.passRate >= 70 ? 'text-warning-500' : 'text-danger-500'} mb-1" data-i18n="${metrics.passRate >= 90 ? 'excellent' : metrics.passRate >= 70 ? 'good' : 'needsWork'}">${metrics.passRate >= 90 ? 'Excelente' : metrics.passRate >= 70 ? 'Bom' : 'Precisa Melhorar'}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="healthStatus">Status de Saude</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Test Results Section -->
      <section id="tests" class="section hidden space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="testResults">Resultados dos Testes</h2>
            <p id="tests-subtitle" class="text-sm text-slate-500 dark:text-slate-400 mt-1" data-i18n="showingAllTests">Mostrando todos os testes</p>
          </div>
          <div class="flex gap-2">
            <button class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white transition-all" data-filter="all"><span data-i18n="all">Todos</span> (${metrics.totalTests})</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="passed"><span data-i18n="passed">Passou</span> (${metrics.passed})</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="failed"><span data-i18n="failed">Falhou</span> (${metrics.failed})</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="pending"><span data-i18n="skipped">Ignorado</span> (${metrics.pending})</button>
          </div>
        </div>

        <div id="tests-list" class="space-y-3">
          ${this.generateTestList(allTests)}
        </div>
      </section>

      <!-- Coverage Section -->
      <section id="coverage" class="section hidden space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="featureCoverage">Cobertura por Funcionalidade</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.generateFeatureCoverageCards(metrics.featureCoverage)}
        </div>
      </section>

      <!-- History Section -->
      <section id="history" class="section hidden space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="executionHistory">Historico de Execucoes</h2>
          <span class="text-sm text-slate-500">${historyData.length} <span data-i18n="total">execucoes</span></span>
        </div>
        <div id="history-list" class="space-y-3">
          ${this.generateHistoryList(historyData)}
        </div>
      </section>

    </main>
  </div>

  <!-- Test Detail Modal -->
  <div id="test-modal" class="fixed inset-0 z-[100] hidden">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeModal()"></div>
    <div class="absolute inset-4 md:inset-10 lg:inset-20 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <div id="modal-header" class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700"></div>
      <div id="modal-content" class="flex-1 overflow-auto p-6"></div>
    </div>
  </div>

  <script>
    Chart.register(ChartDataLabels);

    const chartColors = { passed: '#10b981', failed: '#ef4444', pending: '#f59e0b', primary: '#6366f1', secondary: '#8b5cf6', tertiary: '#ec4899', quaternary: '#14b8a6' };
    const statusLabels = ['passed', 'failed', 'pending'];
    const typeLabels = ['e2e', 'mock', 'integration', 'unit'];

    // Results Chart
    const resultsCtx = document.getElementById('resultsChart').getContext('2d');
    const resultsChart = new Chart(resultsCtx, {
      type: 'doughnut',
      data: {
        labels: [t('passed'), t('failed'), t('skipped')],
        datasets: [{ data: [${metrics.passed}, ${metrics.failed}, ${metrics.pending}], backgroundColor: [chartColors.passed, chartColors.failed, chartColors.pending], borderWidth: 0, hoverOffset: 12 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        onClick: (e, elements) => { if (elements.length > 0) showTestsByStatus(statusLabels[elements[0].index]); },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyle: 'circle', font: { size: 12 }, color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569' } },
          datalabels: { color: '#fff', font: { weight: 'bold', size: 14 }, formatter: (value, ctx) => { const total = ctx.dataset.data.reduce((a, b) => a + b, 0); const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0; return pct > 5 ? pct + '%' : ''; } }
        }
      }
    });

    // Coverage Chart
    const coverageCtx = document.getElementById('coverageChart').getContext('2d');
    const coverageChart = new Chart(coverageCtx, {
      type: 'bar',
      data: {
        labels: [t('e2eTests'), t('mockTests'), t('integration'), t('unit')],
        datasets: [{ data: [${metrics.testDistribution.e2e}, ${metrics.testDistribution.mock}, ${metrics.testDistribution.integration}, ${metrics.testDistribution.unit}], backgroundColor: [chartColors.primary, chartColors.secondary, chartColors.tertiary, chartColors.quaternary], borderRadius: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        onClick: (e, elements) => { if (elements.length > 0) showTestsByType(typeLabels[elements[0].index]); },
        plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'top', color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b', font: { weight: 'bold', size: 12 } } },
        scales: { y: { beginAtZero: true, grid: { color: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }, x: { grid: { display: false } } }
      }
    });

    // Theme Toggle
    function toggleTheme() {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      updateCharts();
    }

    // Language Toggle
    function toggleLanguage() {
      window.currentLang = window.currentLang === 'pt-BR' ? 'en' : 'pt-BR';
      localStorage.setItem('lang', window.currentLang);
      document.getElementById('current-lang').textContent = window.currentLang === 'pt-BR' ? 'PT' : 'EN';
      updateTranslations();
      updateCharts();
    }

    function updateTranslations() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
      });
    }

    function updateCharts() {
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#94a3b8' : '#475569';
      resultsChart.data.labels = [t('passed'), t('failed'), t('skipped')];
      coverageChart.data.labels = [t('e2eTests'), t('mockTests'), t('integration'), t('unit')];
      resultsChart.options.plugins.legend.labels.color = textColor;
      coverageChart.options.plugins.datalabels.color = isDark ? '#e2e8f0' : '#1e293b';
      resultsChart.update();
      coverageChart.update();
    }

    // Load saved preferences - PT-BR is default
    if (localStorage.getItem('theme') === 'light') document.documentElement.classList.remove('dark');
    else if (localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
    window.currentLang = localStorage.getItem('lang') || 'pt-BR';
    document.getElementById('current-lang').textContent = window.currentLang === 'pt-BR' ? 'PT' : 'EN';
    updateTranslations();

    // Navigation
    function navigateTo(sectionId, subtitle = null) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('[data-section="' + sectionId + '"]')?.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
      document.getElementById(sectionId)?.classList.remove('hidden');

      const breadcrumb = document.getElementById('breadcrumb');
      if (sectionId !== 'dashboard') { breadcrumb.classList.remove('hidden'); document.getElementById('breadcrumb-current').textContent = document.querySelector('[data-section="' + sectionId + '"] span')?.textContent || sectionId; }
      else breadcrumb.classList.add('hidden');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => { e.preventDefault(); navigateTo(item.dataset.section); });
    });

    // Show tests by status
    function showTestsByStatus(status) {
      navigateTo('tests');
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const isActive = btn.dataset.filter === status;
        btn.classList.toggle('active', isActive);
        btn.classList.toggle('bg-primary-500', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-slate-100', !isActive);
        btn.classList.toggle('dark:bg-slate-700', !isActive);
      });
      document.querySelectorAll('.test-item').forEach(item => {
        item.style.display = (status === 'all' || item.dataset.status === status) ? 'flex' : 'none';
      });
      const count = status === 'all' ? window.allTests.length : window.allTests.filter(t => t.status === status).length;
      document.getElementById('tests-subtitle').textContent = status === 'all' ? t('showingAllTests') : t('showingTests').replace('{status}', t(status === 'pending' ? 'skipped' : status)) + ' (' + count + ')';
    }

    // Show tests by type
    function showTestsByType(type) {
      navigateTo('tests');
      const matchingTests = window.allTests.filter(t => {
        const file = (t.file || '').toLowerCase();
        if (type === 'mock') return file.includes('mock');
        if (type === 'integration') return file.includes('api');
        if (type === 'e2e') return !file.includes('mock') && !file.includes('api');
        return false;
      });
      document.querySelectorAll('.test-item').forEach(item => {
        item.style.display = matchingTests.some(t => t.id === item.dataset.testId) ? 'flex' : 'none';
      });
      document.getElementById('tests-subtitle').textContent = t(type + 'Tests') + ' (' + matchingTests.length + ' testes)';
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => showTestsByStatus(btn.dataset.filter));
    });

    // Date handling
    function onDateInputChange(value) {
      // Validate DD/MM/YYYY format
      const regex = /^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/;
      if (regex.test(value)) {
        loadHistoryExecution(value);
      }
    }

    function onDatePickerChange(value) {
      // Convert YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = value.split('-');
      const formatted = day + '/' + month + '/' + year;
      document.getElementById('date-input').value = formatted;
      loadHistoryExecution(formatted);
    }

    function loadHistoryExecution(dateStr) {
      // Find execution in history
      const exec = window.historyData.find(e => e.date === dateStr);
      if (exec) {
        showHistoryModal(exec);
      } else {
        alert(t('noHistoryData') + ' ' + dateStr);
      }
    }

    // History Modal with full report
    function showHistoryModal(exec) {
      const passRate = exec.summary.passRate || 0;
      const healthColor = passRate >= 90 ? 'success' : passRate >= 70 ? 'warning' : 'danger';
      const healthText = passRate >= 90 ? t('excellent') : passRate >= 70 ? t('good') : t('needsWork');

      // Build tags HTML
      let tagsHtml = '';
      if (exec.tags) {
        const tagConfig = [
          { key: 'squad', color: 'primary', icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },
          { key: 'executionType', color: 'secondary', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
          { key: 'product', color: 'info', icon: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' },
          { key: 'module', color: 'warning', icon: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>' },
          { key: 'functionality', color: 'success', icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' }
        ];
        tagConfig.forEach(tag => {
          if (exec.tags[tag.key]) {
            tagsHtml += '<span class="tag-badge bg-' + tag.color + '-500/10 text-' + tag.color + '-600 dark:text-' + tag.color + '-400"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + tag.icon + '</svg>' + exec.tags[tag.key] + '</span>';
          }
        });
      }

      // Header HTML
      document.getElementById('modal-header').innerHTML = '<div class="flex items-center gap-4 flex-1"><div class="w-14 h-14 rounded-xl bg-' + healthColor + '-500/10 flex items-center justify-center"><span class="text-xl font-bold text-' + healthColor + '-500">' + passRate + '%</span></div><div class="flex-1"><h3 class="text-xl font-bold text-slate-900 dark:text-white">' + t('executionHistory') + ' - ' + exec.date + '</h3><div class="flex flex-wrap items-center gap-2 mt-2">' + tagsHtml + '</div></div></div><button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"><svg class="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';

      // Content HTML - Stats Cards
      let content = '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">';
      content += '<div class="bg-info-500/10 rounded-xl p-4 text-center"><span class="block text-3xl font-bold text-info-500">' + exec.summary.total + '</span><span class="text-sm text-slate-500">' + t('totalTests') + '</span></div>';
      content += '<div class="bg-success-500/10 rounded-xl p-4 text-center cursor-pointer hover:ring-2 hover:ring-success-500" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'passed\\')"><span class="block text-3xl font-bold text-success-500">' + exec.summary.passed + '</span><span class="text-sm text-slate-500">' + t('passed') + '</span></div>';
      content += '<div class="bg-danger-500/10 rounded-xl p-4 text-center cursor-pointer hover:ring-2 hover:ring-danger-500" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'failed\\')"><span class="block text-3xl font-bold text-danger-500">' + exec.summary.failed + '</span><span class="text-sm text-slate-500">' + t('failed') + '</span></div>';
      content += '<div class="bg-warning-500/10 rounded-xl p-4 text-center cursor-pointer hover:ring-2 hover:ring-warning-500" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'pending\\')"><span class="block text-3xl font-bold text-warning-500">' + exec.summary.skipped + '</span><span class="text-sm text-slate-500">' + t('skipped') + '</span></div>';
      content += '</div>';

      // Pass Rate Ring
      const strokeOffset = 339.292 - (339.292 * passRate) / 100;
      content += '<div class="flex items-center gap-8 mb-6 p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl">';
      content += '<div class="relative w-32 h-32"><svg class="w-full h-full" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" class="text-slate-200 dark:text-slate-700"/><circle cx="60" cy="60" r="54" fill="none" stroke="' + (passRate >= 90 ? '#10b981' : passRate >= 70 ? '#f59e0b' : '#ef4444') + '" stroke-width="8" stroke-linecap="round" style="stroke-dasharray: 339.292; stroke-dashoffset: ' + strokeOffset + '; transform: rotate(-90deg); transform-origin: 50% 50%;"/></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-2xl font-bold text-' + healthColor + '-500">' + passRate + '%</span><span class="text-xs text-slate-500">' + t('passRate') + '</span></div></div>';
      content += '<div class="flex-1 grid grid-cols-2 gap-4">';
      content += '<div><span class="block text-sm text-slate-500">' + t('totalDuration') + '</span><span class="text-xl font-bold text-primary-500">' + formatDuration(exec.summary.duration) + '</span></div>';
      content += '<div><span class="block text-sm text-slate-500">' + t('healthStatus') + '</span><span class="text-xl font-bold text-' + healthColor + '-500">' + healthText + '</span></div>';
      content += '<div><span class="block text-sm text-slate-500">' + t('avgPerTest') + '</span><span class="text-xl font-bold text-primary-500">' + formatDuration(exec.summary.total > 0 ? exec.summary.duration / exec.summary.total : 0) + '</span></div>';
      content += '<div><span class="block text-sm text-slate-500">' + t('executionDate') + '</span><span class="text-xl font-bold text-slate-700 dark:text-slate-300">' + exec.date + '</span></div>';
      content += '</div></div>';

      // Filter buttons
      content += '<div class="flex items-center justify-between mb-4">';
      content += '<h4 class="text-lg font-semibold text-slate-900 dark:text-white">' + t('testResults') + '</h4>';
      content += '<div class="flex gap-2">';
      content += '<button class="history-filter-btn active px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white" data-filter="all" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'all\\')">' + t('all') + '</button>';
      content += '<button class="history-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" data-filter="passed" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'passed\\')">' + t('passed') + '</button>';
      content += '<button class="history-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" data-filter="failed" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'failed\\')">' + t('failed') + '</button>';
      content += '<button class="history-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" data-filter="pending" onclick="filterHistoryTests(\\'' + exec.date + '\\', \\'pending\\')">' + t('skipped') + '</button>';
      content += '</div></div>';

      // Test list - we need to fetch from history file
      content += '<div id="history-tests-list" class="space-y-2 max-h-96 overflow-y-auto">';
      content += '<div class="text-center py-4 text-slate-500">' + t('noTestsFound') + '</div>';
      content += '</div>';

      document.getElementById('modal-content').innerHTML = content;
      document.getElementById('test-modal').classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Load tests from history (fetch the JSON file)
      loadHistoryTests(exec.dateKey || exec.date.split('/').reverse().join('-'));
    }

    // Load tests from history file
    async function loadHistoryTests(dateKey) {
      try {
        const response = await fetch('../../history/' + dateKey + '.json');
        if (response.ok) {
          const data = await response.json();
          window.currentHistoryTests = data.tests || [];
          renderHistoryTests(window.currentHistoryTests, 'all');
        }
      } catch (e) {
        // If fetch fails, use embedded data if available
        console.log('Could not load history file, using embedded data');
      }
    }

    // Render history tests
    function renderHistoryTests(tests, filter) {
      const filteredTests = filter === 'all' ? tests : tests.filter(t => t.status === filter);
      const listEl = document.getElementById('history-tests-list');

      if (filteredTests.length === 0) {
        listEl.innerHTML = '<div class="text-center py-4 text-slate-500">' + t('noTestsFound') + '</div>';
        return;
      }

      let html = '';
      filteredTests.forEach(test => {
        const statusConfig = {
          passed: { bg: 'bg-success-500/10', text: 'text-success-500', icon: '<polyline points="20,6 9,17 4,12"/>' },
          failed: { bg: 'bg-danger-500/10', text: 'text-danger-500', icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
          pending: { bg: 'bg-warning-500/10', text: 'text-warning-500', icon: '<line x1="8" y1="12" x2="16" y2="12"/>' }
        };
        const config = statusConfig[test.status] || statusConfig.pending;

        html += '<div class="history-test-item flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 cursor-pointer" data-status="' + test.status + '" onclick="showHistoryTestDetail(' + JSON.stringify(test).replace(/"/g, '&quot;') + ')">';
        html += '<div class="w-8 h-8 rounded-lg flex items-center justify-center ' + config.bg + '"><svg class="w-4 h-4 ' + config.text + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + config.icon + '</svg></div>';
        html += '<div class="flex-1 min-w-0"><h5 class="font-medium text-slate-900 dark:text-white text-sm truncate">' + escapeHtml(test.title) + '</h5><p class="text-xs text-slate-500 truncate">' + escapeHtml((test.suitePath || []).join(' > ')) + '</p></div>';
        html += '<span class="text-xs text-slate-400 font-mono">' + formatDuration(test.duration) + '</span>';
        html += '<svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>';
        html += '</div>';
      });

      listEl.innerHTML = html;
    }

    // Filter history tests
    function filterHistoryTests(dateStr, filter) {
      // Update buttons
      document.querySelectorAll('.history-filter-btn').forEach(btn => {
        const isActive = btn.dataset.filter === filter;
        btn.classList.toggle('active', isActive);
        btn.classList.toggle('bg-primary-500', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-slate-100', !isActive);
        btn.classList.toggle('dark:bg-slate-700', !isActive);
        btn.classList.toggle('text-slate-600', !isActive);
        btn.classList.toggle('dark:text-slate-300', !isActive);
      });

      if (window.currentHistoryTests) {
        renderHistoryTests(window.currentHistoryTests, filter);
      }
    }

    // Show history test detail (nested modal)
    function showHistoryTestDetail(test) {
      const statusConfig = {
        passed: { bg: 'bg-success-500', text: 'text-success-500', label: t('passed').toUpperCase(), icon: '<polyline points="20,6 9,17 4,12"/>' },
        failed: { bg: 'bg-danger-500', text: 'text-danger-500', label: t('failed').toUpperCase(), icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
        pending: { bg: 'bg-warning-500', text: 'text-warning-500', label: t('skipped').toUpperCase(), icon: '<line x1="8" y1="12" x2="16" y2="12"/>' }
      };
      const config = statusConfig[test.status] || statusConfig.pending;

      let detailHtml = '<div class="fixed inset-0 z-[110] flex items-center justify-center p-4" id="history-test-detail-modal">';
      detailHtml += '<div class="absolute inset-0 bg-black/30" onclick="closeHistoryTestDetail()"></div>';
      detailHtml += '<div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">';

      // Header
      detailHtml += '<div class="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">';
      detailHtml += '<div class="w-10 h-10 rounded-lg ' + config.bg + '/10 flex items-center justify-center"><svg class="w-5 h-5 ' + config.text + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + config.icon + '</svg></div>';
      detailHtml += '<div class="flex-1"><h4 class="font-bold text-slate-900 dark:text-white">' + escapeHtml(test.title) + '</h4><span class="text-xs ' + config.text + ' font-semibold">' + config.label + '</span></div>';
      detailHtml += '<button onclick="closeHistoryTestDetail()" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
      detailHtml += '</div>';

      // Content
      detailHtml += '<div class="p-4 space-y-4">';

      // Path
      detailHtml += '<div><span class="text-xs font-semibold text-slate-500 uppercase">' + t('testPath') + '</span><div class="flex flex-wrap gap-1 mt-1">';
      (test.suitePath || []).forEach((p, i) => {
        detailHtml += '<span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">' + escapeHtml(p) + '</span>';
        if (i < (test.suitePath || []).length - 1) detailHtml += '<span class="text-slate-300">></span>';
      });
      detailHtml += '</div></div>';

      // Metrics
      detailHtml += '<div class="grid grid-cols-3 gap-3">';
      detailHtml += '<div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center"><span class="block text-lg font-bold text-primary-500">' + formatDuration(test.duration) + '</span><span class="text-xs text-slate-500">' + t('duration') + '</span></div>';
      detailHtml += '<div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center"><span class="block text-lg font-bold text-primary-500">' + (test.speed || 'N/A') + '</span><span class="text-xs text-slate-500">' + t('speed') + '</span></div>';
      detailHtml += '<div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center"><span class="block text-lg font-bold ' + config.text + '">' + config.label + '</span><span class="text-xs text-slate-500">' + t('status') + '</span></div>';
      detailHtml += '</div>';

      // Error if failed
      if (test.status === 'failed' && test.err) {
        detailHtml += '<div><span class="text-xs font-semibold text-danger-500 uppercase flex items-center gap-1"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' + t('errorMessage') + '</span>';
        detailHtml += '<div class="mt-1 bg-danger-500/5 border border-danger-500/20 rounded-lg p-3"><p class="text-danger-600 dark:text-danger-400 font-mono text-xs whitespace-pre-wrap">' + escapeHtml(test.err.message || 'Unknown error') + '</p></div></div>';

        if (test.err.estack || test.err.stack) {
          detailHtml += '<div><span class="text-xs font-semibold text-slate-500 uppercase">' + t('stackTrace') + '</span>';
          detailHtml += '<div class="mt-1 bg-slate-900 rounded-lg p-3 overflow-x-auto"><pre class="text-xs text-slate-300 font-mono whitespace-pre-wrap">' + escapeHtml(test.err.estack || test.err.stack) + '</pre></div></div>';
        }
      }

      // Code
      if (test.code) {
        detailHtml += '<div><span class="text-xs font-semibold text-slate-500 uppercase">' + t('testCode') + '</span>';
        detailHtml += '<div class="mt-1 bg-slate-900 rounded-lg p-3 overflow-x-auto"><pre class="text-xs text-slate-300 font-mono">' + escapeHtml(test.code) + '</pre></div></div>';
      }

      detailHtml += '</div></div></div>';

      // Add to body
      const existingModal = document.getElementById('history-test-detail-modal');
      if (existingModal) existingModal.remove();
      document.body.insertAdjacentHTML('beforeend', detailHtml);
    }

    function closeHistoryTestDetail() {
      const modal = document.getElementById('history-test-detail-modal');
      if (modal) modal.remove();
    }

    // Show test detail
    function showTestDetail(testId) {
      const test = window.allTests.find(t => t.id === testId);
      if (!test) return;

      const statusConfig = {
        passed: { bg: 'bg-success-500', text: 'text-success-500', label: t('passed').toUpperCase(), icon: '<polyline points="20,6 9,17 4,12"/>' },
        failed: { bg: 'bg-danger-500', text: 'text-danger-500', label: t('failed').toUpperCase(), icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
        pending: { bg: 'bg-warning-500', text: 'text-warning-500', label: t('skipped').toUpperCase(), icon: '<line x1="8" y1="12" x2="16" y2="12"/>' }
      };
      const config = statusConfig[test.status];

      document.getElementById('modal-header').innerHTML = '<div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl ' + config.bg + '/10 flex items-center justify-center"><svg class="w-6 h-6 ' + config.text + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/>' + config.icon + '</svg></div><div><h3 class="text-lg font-bold text-slate-900 dark:text-white">' + escapeHtml(test.title) + '</h3><div class="flex items-center gap-3 mt-1"><span class="px-2 py-0.5 text-xs font-bold rounded-full ' + config.bg + '/10 ' + config.text + '">' + config.label + '</span><span class="text-sm text-slate-500 dark:text-slate-400">' + formatDuration(test.duration) + '</span></div></div></div><button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"><svg class="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';

      let content = '<div class="mb-6"><h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-2">' + t('testPath') + '</h4><div class="flex flex-wrap items-center gap-2">';
      test.suitePath.forEach((path, i) => { content += '<span class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300">' + escapeHtml(path) + '</span>' + (i < test.suitePath.length - 1 ? '<svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>' : ''); });
      content += '</div></div>';

      content += '<div class="mb-6"><h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-2">' + t('fullTitle') + '</h4><p class="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg font-mono text-sm">' + escapeHtml(test.fullTitle) + '</p></div>';

      content += '<div class="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-2xl font-bold text-primary-500">' + formatDuration(test.duration) + '</span><span class="text-xs text-slate-500">' + t('duration') + '</span></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-2xl font-bold text-primary-500">' + (test.speed || 'N/A') + '</span><span class="text-xs text-slate-500">' + t('speed') + '</span></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-2xl font-bold ' + config.text + '">' + config.label + '</span><span class="text-xs text-slate-500">' + t('status') + '</span></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-lg font-bold text-primary-500 truncate" title="' + escapeHtml(test.file) + '">' + (test.file ? test.file.split(/[\\\\\\\\/]/).pop() : 'N/A') + '</span><span class="text-xs text-slate-500">' + t('file') + '</span></div></div>';

      if (test.status === 'failed' && test.err) {
        content += '<div class="mb-6"><h4 class="text-sm font-semibold text-danger-500 mb-2 flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' + t('errorMessage') + '</h4><div class="bg-danger-500/5 border border-danger-500/20 rounded-lg p-4"><p class="text-danger-600 dark:text-danger-400 font-mono text-sm whitespace-pre-wrap">' + escapeHtml(test.err.message || 'Unknown error') + '</p></div></div>';
        if (test.err.estack || test.err.stack) {
          content += '<div class="mb-6"><h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-2">' + t('stackTrace') + '</h4><div class="bg-slate-900 rounded-lg p-4 overflow-x-auto"><pre class="text-xs text-slate-300 font-mono whitespace-pre-wrap">' + escapeHtml(test.err.estack || test.err.stack) + '</pre></div></div>';
        }
      }

      if (test.code) {
        content += '<div class="mb-6"><h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-2">' + t('testCode') + '</h4><div class="bg-slate-900 rounded-lg p-4 overflow-x-auto"><pre class="text-sm font-mono text-slate-300">' + escapeHtml(test.code) + '</pre></div></div>';
      }

      document.getElementById('modal-content').innerHTML = content;
      document.getElementById('test-modal').classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() { document.getElementById('test-modal').classList.add('hidden'); document.body.style.overflow = ''; }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    function escapeHtml(text) { if (!text) return ''; const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
    function formatDuration(ms) { if (!ms) return '0ms'; if (ms < 1000) return ms + 'ms'; if (ms < 60000) return (ms / 1000).toFixed(2) + 's'; return Math.floor(ms / 60000) + 'm ' + ((ms % 60000) / 1000).toFixed(0) + 's'; }

    function exportReport() {
      const data = {
        generatedAt: new Date().toISOString(),
        tags: window.currentTags,
        summary: {
          total: ${metrics.totalTests},
          passed: ${metrics.passed},
          failed: ${metrics.failed},
          skipped: ${metrics.pending},
          passRate: ${metrics.passRate},
          duration: ${metrics.duration}
        },
        tests: window.allTests
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-report-' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>

</body>
</html>`;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        options.inputFile = args[++i];
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--name':
        options.projectName = args[++i];
        break;
      case '--theme':
        options.theme = args[++i];
        break;
      case '--squad':
        options.squad = args[++i];
        break;
      case '--exec-type':
        options.executionType = args[++i];
        break;
      case '--product':
        options.product = args[++i];
        break;
      case '--module':
        options.module = args[++i];
        break;
      case '--functionality':
        options.functionality = args[++i];
        break;
      case '--date':
        options.date = args[++i];
        break;
    }
  }

  return options;
}

// Main execution
const options = parseArgs();
const generator = new ReportGenerator(options);
generator.generate();

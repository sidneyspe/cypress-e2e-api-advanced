/**
 * Custom Report Generator for Cypress Tests
 * Uses Tailwind CSS for styling with full customization support
 * Features: Interactive charts, detailed test view, error formatting, i18n
 */

const fs = require('fs');
const path = require('path');

// Load theme configuration
let themeConfig;
try {
  themeConfig = require('./theme.config.js');
} catch (e) {
  themeConfig = getDefaultTheme();
}

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

// Translations
const translations = {
  en: {
    testReport: 'Test Report',
    dashboard: 'Dashboard',
    testResults: 'Test Results',
    coverage: 'Coverage',
    executionSummary: 'Execution Summary & Analytics',
    totalTests: 'Total Tests',
    passed: 'Passed',
    failed: 'Failed',
    skipped: 'Skipped',
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
  },
  'pt-BR': {
    testReport: 'Relatório de Testes',
    dashboard: 'Painel',
    testResults: 'Resultados dos Testes',
    coverage: 'Cobertura',
    executionSummary: 'Resumo da Execução e Análises',
    totalTests: 'Total de Testes',
    passed: 'Passou',
    failed: 'Falhou',
    skipped: 'Ignorado',
    passRate: 'Taxa de Sucesso',
    testResultsDistribution: 'Distribuição dos Resultados',
    testTypeDistribution: 'Distribuição por Tipo de Teste',
    clickForDetails: 'Clique para ver detalhes',
    clickBarsForDetails: 'Clique nas barras para detalhes',
    executionMetrics: 'Métricas de Execução',
    totalDuration: 'Duração Total',
    avgPerTest: 'Média por Teste',
    testSuites: 'Suites de Teste',
    healthStatus: 'Status de Saúde',
    excellent: 'Excelente',
    good: 'Bom',
    needsWork: 'Precisa Melhorar',
    showingAllTests: 'Mostrando todos os testes',
    showingTests: 'Mostrando testes {status}',
    all: 'Todos',
    featureCoverage: 'Cobertura por Funcionalidade',
    testDetails: 'Detalhes do Teste',
    testPath: 'Caminho do Teste',
    fullTitle: 'Título Completo',
    duration: 'Duração',
    speed: 'Velocidade',
    status: 'Status',
    file: 'Arquivo',
    errorMessage: 'Mensagem de Erro',
    stackTrace: 'Stack Trace',
    actual: 'Atual',
    expected: 'Esperado',
    diff: 'Diferença',
    testCode: 'Código do Teste',
    screenshot: 'Captura de Tela',
    export: 'Exportar',
    theme: 'Tema',
    language: 'Idioma',
    e2eTests: 'Testes E2E',
    mockTests: 'Testes Mock',
    integration: 'Integração',
    unit: 'Unitário',
    total: 'total',
    noTestsFound: 'Nenhum teste encontrado',
    noCoverageData: 'Sem dados de cobertura',
  },
};

class ReportGenerator {
  constructor(options = {}) {
    this.inputFile = options.inputFile || 'cypress/results/output.json';
    this.outputDir = options.outputDir || 'cypress/results/report';
    this.projectName = options.projectName || themeConfig.branding?.name || 'Test Report';
    this.theme = options.theme || 'dark';
    this.config = themeConfig;
    this.testIndex = 0;
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
    const html = this.generateHTML(reportData, metrics, allTests, allSuites);

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
          // Add file info to suite
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

      // Process tests in this suite
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

      // Process nested suites
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
    const passed = allTests.filter(t => t.status === 'passed').length;
    const failed = allTests.filter(t => t.status === 'failed').length;
    const pending = allTests.filter(t => t.status === 'pending').length;
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
      // Use the first level of the suite path as the feature name
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

  getGoogleFontsUrl() {
    const fonts = this.config.fonts?.googleFonts || ['Inter:wght@400;500;600;700'];
    return `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}`).join('&')}&display=swap`;
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  generateHTML(data, metrics, allTests, allSuites) {
    const colors = this.config.colors || {};
    const testsJson = JSON.stringify(allTests).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const translationsJson = JSON.stringify(translations);

    return `<!DOCTYPE html>
<html lang="en" class="${this.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.projectName} - Test Report</title>

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
    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3); }
    .progress-ring-circle { transition: stroke-dashoffset 1s ease-out; transform: rotate(-90deg); transform-origin: 50% 50%; }
    .chart-container { position: relative; height: 280px; }
    #resultsChart, #coverageChart { cursor: pointer; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">

  <script>
    // Store data
    window.allTests = JSON.parse('${testsJson}');
    window.translations = ${translationsJson};
    window.currentLang = localStorage.getItem('lang') || 'en';

    function t(key) {
      return window.translations[window.currentLang]?.[key] || window.translations['en'][key] || key;
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
            <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-primary-500/10 text-primary-500 rounded-full" data-i18n="testReport">Test Report</span>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <a href="#dashboard" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group active" data-section="dashboard">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="dashboard">Dashboard</span>
        </a>

        <a href="#tests" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group" data-section="tests">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="testResults">Test Results</span>
        </a>

        <a href="#coverage" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group" data-section="coverage">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500" data-i18n="coverage">Coverage</span>
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
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300" data-i18n="theme">Theme</span>
        </button>

        <!-- Language Toggle -->
        <button onclick="toggleLanguage()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
          <svg class="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300" data-i18n="language">Language</span>
          <span id="current-lang" class="ml-auto text-xs font-bold text-primary-500 uppercase">EN</span>
        </button>

        <div class="flex items-center justify-between pt-2">
          <span class="text-xs text-slate-400">v2.2.0</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-72 p-8">

      <div id="breadcrumb" class="hidden mb-4">
        <nav class="flex items-center gap-2 text-sm">
          <button onclick="navigateTo('dashboard')" class="text-primary-500 hover:text-primary-600 font-medium" data-i18n="dashboard">Dashboard</button>
          <span class="text-slate-400">/</span>
          <span id="breadcrumb-current" class="text-slate-600 dark:text-slate-300"></span>
        </nav>
      </div>

      <header class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 id="page-title" class="text-3xl font-bold gradient-text" data-i18n="dashboard">Dashboard</h2>
          <p id="page-subtitle" class="text-slate-500 dark:text-slate-400 mt-1" data-i18n="executionSummary">Execution Summary & Analytics</p>
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
              <span>${new Date(metrics.startTime).toLocaleDateString('pt-BR')} ${new Date(metrics.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <button onclick="exportReport()" class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-lg">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span data-i18n="export">Export</span>
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
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="totalTests">Total Tests</span>
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
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="passed">Passed</span>
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
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="failed">Failed</span>
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
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="skipped">Skipped</span>
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
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white" data-i18n="testResultsDistribution">Test Results Distribution</h3>
              <span class="text-xs text-slate-400" data-i18n="clickForDetails">Click segments for details</span>
            </div>
            <div class="p-6">
              <div class="chart-container"><canvas id="resultsChart"></canvas></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in" style="animation-delay: 0.4s">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white" data-i18n="testTypeDistribution">Test Type Distribution</h3>
              <span class="text-xs text-slate-400" data-i18n="clickBarsForDetails">Click bars for details</span>
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
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="passRate">Pass Rate</span>
              </div>
            </div>
            <div class="w-full space-y-3">
              <button onclick="showTestsByStatus('passed')" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <span class="w-3 h-3 rounded-full bg-success-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 text-left"><span data-i18n="passed">Passed</span>: ${metrics.passed}</span>
                <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
              <button onclick="showTestsByStatus('failed')" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <span class="w-3 h-3 rounded-full bg-danger-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 text-left"><span data-i18n="failed">Failed</span>: ${metrics.failed}</span>
                <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
              <button onclick="showTestsByStatus('pending')" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <span class="w-3 h-3 rounded-full bg-warning-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 text-left"><span data-i18n="skipped">Skipped</span>: ${metrics.pending}</span>
                <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
              </button>
            </div>
          </div>

          <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 animate-fade-in" style="animation-delay: 0.5s">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6" data-i18n="executionMetrics">Execution Metrics</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${this.formatDuration(metrics.duration)}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="totalDuration">Total Duration</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${metrics.totalTests > 0 ? this.formatDuration(metrics.duration / metrics.totalTests) : '0ms'}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="avgPerTest">Avg. per Test</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${Object.keys(metrics.featureCoverage).length}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="testSuites">Test Suites</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold ${metrics.passRate >= 90 ? 'text-success-500' : metrics.passRate >= 70 ? 'text-warning-500' : 'text-danger-500'} mb-1" data-i18n="${metrics.passRate >= 90 ? 'excellent' : metrics.passRate >= 70 ? 'good' : 'needsWork'}">${metrics.passRate >= 90 ? 'Excellent' : metrics.passRate >= 70 ? 'Good' : 'Needs Work'}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400" data-i18n="healthStatus">Health Status</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Test Results Section -->
      <section id="tests" class="section hidden space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="testResults">Test Results</h2>
            <p id="tests-subtitle" class="text-sm text-slate-500 dark:text-slate-400 mt-1" data-i18n="showingAllTests">Showing all tests</p>
          </div>
          <div class="flex gap-2">
            <button class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white transition-all" data-filter="all"><span data-i18n="all">All</span> (${metrics.totalTests})</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="passed"><span data-i18n="passed">Passed</span> (${metrics.passed})</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="failed"><span data-i18n="failed">Failed</span> (${metrics.failed})</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="pending"><span data-i18n="skipped">Skipped</span> (${metrics.pending})</button>
          </div>
        </div>

        <div id="tests-list" class="space-y-3">
          ${this.generateTestList(allTests)}
        </div>
      </section>

      <!-- Coverage Section -->
      <section id="coverage" class="section hidden space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="featureCoverage">Feature Coverage</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.generateFeatureCoverageCards(metrics.featureCoverage)}
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
      window.currentLang = window.currentLang === 'en' ? 'pt-BR' : 'en';
      localStorage.setItem('lang', window.currentLang);
      document.getElementById('current-lang').textContent = window.currentLang === 'en' ? 'EN' : 'PT';
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

    // Load saved preferences
    if (localStorage.getItem('theme') === 'light') document.documentElement.classList.remove('dark');
    else if (localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
    window.currentLang = localStorage.getItem('lang') || 'en';
    document.getElementById('current-lang').textContent = window.currentLang === 'en' ? 'EN' : 'PT';
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
      document.getElementById('tests-subtitle').textContent = status === 'all' ? t('showingAllTests') : t('showingTests').replace('{status}', t(status)) + ' (' + count + ')';
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
      document.getElementById('tests-subtitle').textContent = t(type + 'Tests') + ' (' + matchingTests.length + ' tests)';
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => showTestsByStatus(btn.dataset.filter));
    });

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

      content += '<div class="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-2xl font-bold text-primary-500">' + formatDuration(test.duration) + '</span><span class="text-xs text-slate-500">' + t('duration') + '</span></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-2xl font-bold text-primary-500">' + (test.speed || 'N/A') + '</span><span class="text-xs text-slate-500">' + t('speed') + '</span></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-2xl font-bold ' + config.text + '">' + config.label + '</span><span class="text-xs text-slate-500">' + t('status') + '</span></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center"><span class="block text-lg font-bold text-primary-500 truncate" title="' + escapeHtml(test.file) + '">' + (test.file ? test.file.split(/[\\\\/]/).pop() : 'N/A') + '</span><span class="text-xs text-slate-500">' + t('file') + '</span></div></div>';

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
      const data = { project: '${this.projectName}', timestamp: new Date().toISOString(), metrics: ${JSON.stringify(metrics)}, tests: window.allTests };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'test-report-' + new Date().toISOString().split('T')[0] + '.json'; a.click();
    }
  </script>
</body>
</html>`;
  }

  generateTestList(allTests) {
    if (allTests.length === 0) {
      return '<p class="text-slate-500 dark:text-slate-400 text-center py-8" data-i18n="noTestsFound">No tests found</p>';
    }

    const statusConfig = {
      passed: { bg: 'bg-success-500/10', text: 'text-success-500', icon: '<polyline points="20,6 9,17 4,12"/>' },
      failed: { bg: 'bg-danger-500/10', text: 'text-danger-500', icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
      pending: { bg: 'bg-warning-500/10', text: 'text-warning-500', icon: '<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>' },
    };

    return allTests.map((test) => {
      const config = statusConfig[test.status];
      const hasError = test.status === 'failed' && test.err;

      return `
        <div class="test-item flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer group"
             data-test-id="${test.id}"
             data-status="${test.status}"
             onclick="showTestDetail('${test.id}')">
          <div class="w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 ${config.text}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${config.icon}</svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-slate-400 font-mono">${this.escapeHtml(test.suitePath.join(' > '))}</span>
            </div>
            <span class="block text-sm font-medium text-slate-900 dark:text-white">${this.escapeHtml(test.title)}</span>
            ${hasError ? `<span class="block text-xs text-danger-500 font-mono mt-1 truncate">${this.escapeHtml((test.err?.message || '').substring(0, 100))}${(test.err?.message || '').length > 100 ? '...' : ''}</span>` : ''}
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <span class="text-xs font-mono text-slate-400">${this.formatDuration(test.duration)}</span>
            <svg class="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
          </div>
        </div>
      `;
    }).join('');
  }

  generateFeatureCoverageCards(coverage) {
    const entries = Object.entries(coverage);
    if (entries.length === 0) {
      return '<p class="text-slate-500 dark:text-slate-400 text-center py-8 col-span-full" data-i18n="noCoverageData">No coverage data</p>';
    }

    return entries.map(([feature, stats]) => {
      const percentage = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(0) : 0;
      const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'warning';
      const config = {
        excellent: { gradient: 'from-success-500 to-emerald-400', badge: 'bg-success-500/10 text-success-500' },
        good: { gradient: 'from-info-500 to-blue-400', badge: 'bg-info-500/10 text-info-500' },
        warning: { gradient: 'from-warning-500 to-amber-400', badge: 'bg-warning-500/10 text-warning-500' },
      }[status];

      return `
        <div class="hover-lift bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-slate-900 dark:text-white truncate pr-2">${this.escapeHtml(feature)}</h4>
            <span class="px-3 py-1 rounded-full text-sm font-bold ${config.badge} flex-shrink-0">${percentage}%</span>
          </div>
          <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
            <div class="h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-success-500 font-medium">${stats.passed} <span data-i18n="passed">passed</span></span>
            <span class="text-danger-500 font-medium">${stats.failed} <span data-i18n="failed">failed</span></span>
            <span class="text-warning-500 font-medium">${stats.pending} <span data-i18n="skipped">skipped</span></span>
            <span class="text-slate-400">${stats.total} <span data-i18n="total">total</span></span>
          </div>
        </div>
      `;
    }).join('');
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  writeReport(html) {
    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
  }
}

// CLI
const args = process.argv.slice(2);
const options = {};
args.forEach((arg, i) => {
  if (arg === '--input' && args[i + 1]) options.inputFile = args[i + 1];
  if (arg === '--output' && args[i + 1]) options.outputDir = args[i + 1];
  if (arg === '--name' && args[i + 1]) options.projectName = args[i + 1];
  if (arg === '--theme' && args[i + 1]) options.theme = args[i + 1];
});

const generator = new ReportGenerator(options);
generator.generate();

module.exports = ReportGenerator;

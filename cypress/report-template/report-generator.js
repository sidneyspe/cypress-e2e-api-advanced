/**
 * Custom Report Generator for Cypress Tests
 * Uses Tailwind CSS for styling with full customization support
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
      families: {
        sans: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', monospace",
      },
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

class ReportGenerator {
  constructor(options = {}) {
    this.inputFile = options.inputFile || 'cypress/results/output.json';
    this.outputDir = options.outputDir || 'cypress/results/report';
    this.projectName = options.projectName || themeConfig.branding?.name || 'Test Report';
    this.theme = options.theme || 'dark';
    this.config = themeConfig;
  }

  generate() {
    console.log('🚀 Generating custom test report with Tailwind CSS...');

    const reportData = this.loadReportData();
    if (!reportData) {
      console.error('❌ Failed to load report data');
      return;
    }

    const metrics = this.calculateMetrics(reportData);
    const html = this.generateHTML(reportData, metrics);

    this.ensureOutputDir();
    this.writeReport(html);

    console.log(`✅ Report generated successfully at: ${this.outputDir}/index.html`);
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

  calculateMetrics(data) {
    const stats = data.stats || {};
    const suites = data.results?.[0]?.suites || [];

    const totalTests = stats.tests || 0;
    const passed = stats.passes || 0;
    const failed = stats.failures || 0;
    const pending = stats.pending || 0;
    const skipped = stats.skipped || 0;
    const duration = stats.duration || 0;

    const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;
    const failRate = totalTests > 0 ? ((failed / totalTests) * 100).toFixed(1) : 0;

    const featureCoverage = this.calculateFeatureCoverage(suites);
    const testDistribution = this.calculateTestDistribution(suites);

    return {
      totalTests,
      passed,
      failed,
      pending,
      skipped,
      duration,
      passRate,
      failRate,
      featureCoverage,
      testDistribution,
      startTime: stats.start || new Date().toISOString(),
      endTime: stats.end || new Date().toISOString(),
    };
  }

  calculateFeatureCoverage(suites) {
    const features = {};

    const processSuite = (suite) => {
      const featureName = suite.title || 'Unknown';
      if (!features[featureName]) {
        features[featureName] = { passed: 0, failed: 0, pending: 0, total: 0 };
      }

      (suite.tests || []).forEach((test) => {
        features[featureName].total++;
        if (test.pass) features[featureName].passed++;
        if (test.fail) features[featureName].failed++;
        if (test.pending || test.skipped) features[featureName].pending++;
      });

      (suite.suites || []).forEach(processSuite);
    };

    suites.forEach(processSuite);
    return features;
  }

  calculateTestDistribution(suites) {
    const distribution = { unit: 0, integration: 0, e2e: 0, mock: 0 };

    const processSuite = (suite, parentPath = '') => {
      const fullPath = parentPath ? `${parentPath}/${suite.file}` : suite.file || '';

      (suite.tests || []).forEach(() => {
        if (fullPath.toLowerCase().includes('mock')) {
          distribution.mock++;
        } else if (fullPath.toLowerCase().includes('api')) {
          distribution.integration++;
        } else {
          distribution.e2e++;
        }
      });

      (suite.suites || []).forEach((s) => processSuite(s, fullPath));
    };

    suites.forEach(processSuite);
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

  generateHTML(data, metrics) {
    const suites = data.results?.[0]?.suites || [];
    const colors = this.config.colors || {};

    return `<!DOCTYPE html>
<html lang="pt-BR" class="${this.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.projectName} - Test Report</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${this.getGoogleFontsUrl()}" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>

  <!-- Tailwind Configuration -->
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
            sans: [${(this.config.fonts?.families?.sans || "'Inter', sans-serif").split(',').map(f => `'${f.trim().replace(/'/g, '')}'`).join(', ')}],
            mono: [${(this.config.fonts?.families?.mono || "'JetBrains Mono', monospace").split(',').map(f => `'${f.trim().replace(/'/g, '')}'`).join(', ')}],
            display: [${(this.config.fonts?.families?.display || "'Poppins', sans-serif").split(',').map(f => `'${f.trim().replace(/'/g, '')}'`).join(', ')}],
          },
          animation: {
            'fade-in': 'fadeIn 0.5s ease-out forwards',
            'slide-in': 'slideIn 0.4s ease-out forwards',
            'scale-in': 'scaleIn 0.3s ease-out forwards',
            'pulse-slow': 'pulse 3s ease-in-out infinite',
            'shimmer': 'shimmer 2s linear infinite',
            'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0', transform: 'translateY(10px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            slideIn: {
              '0%': { opacity: '0', transform: 'translateX(-20px)' },
              '100%': { opacity: '1', transform: 'translateX(0)' },
            },
            scaleIn: {
              '0%': { opacity: '0', transform: 'scale(0.95)' },
              '100%': { opacity: '1', transform: 'scale(1)' },
            },
            bounceIn: {
              '0%': { opacity: '0', transform: 'scale(0.3)' },
              '50%': { transform: 'scale(1.05)' },
              '70%': { transform: 'scale(0.9)' },
              '100%': { opacity: '1', transform: 'scale(1)' },
            },
            shimmer: {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' },
            },
          },
          boxShadow: {
            'glow-primary': '0 0 20px rgba(99, 102, 241, 0.4)',
            'glow-success': '0 0 20px rgba(16, 185, 129, 0.4)',
            'glow-danger': '0 0 20px rgba(239, 68, 68, 0.4)',
            'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4)',
          },
        },
      },
    }
  </script>

  <style>
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }

    /* Glass morphism effect */
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dark .glass {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Gradient text */
    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Progress ring animation */
    .progress-ring-circle {
      transition: stroke-dashoffset 1s ease-out;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }

    /* Hover card effect */
    .hover-lift {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
    }

    /* Stagger animation delays */
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }

    /* Gradient border */
    .gradient-border {
      position: relative;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
      padding: 2px;
      border-radius: 1rem;
    }
    .gradient-border > * {
      background: #0f172a;
      border-radius: calc(1rem - 2px);
    }

    /* Chart container */
    .chart-container {
      position: relative;
      height: 280px;
    }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">
  <div class="flex min-h-screen">

    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-50 animate-slide-in">

      <!-- Logo Section -->
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary">
            <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white">${this.projectName}</h1>
            <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-primary-500/10 text-primary-500 rounded-full">
              Test Report
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <a href="#dashboard" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group active">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500">Dashboard</span>
        </a>

        <a href="#tests" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500">Test Results</span>
        </a>

        <a href="#coverage" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-[.active]:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
          </svg>
          <span class="font-medium group-[.active]:text-primary-500">Coverage</span>
        </a>
      </nav>

      <!-- Theme Toggle & Footer -->
      <div class="p-4 border-t border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <button onclick="toggleTheme()" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
            <svg class="w-5 h-5 hidden dark:block text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg class="w-5 h-5 block dark:hidden text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Theme</span>
          </button>
          <span class="text-xs text-slate-400">v2.0.0</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-72 p-8">

      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 class="text-3xl font-bold gradient-text">Dashboard</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Execution Summary & Analytics</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg class="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span class="font-mono">${this.formatDuration(metrics.duration)}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg class="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>${new Date(metrics.startTime).toLocaleDateString('pt-BR')} ${new Date(metrics.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <button onclick="exportReport()" class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-glow-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </header>

      <!-- Dashboard Section -->
      <section id="dashboard" class="section space-y-8">

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Total Tests Card -->
          <div class="hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in stagger-1">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-info-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-info-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-info-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <path d="M14 2v6h6"/>
                  <path d="M16 13H8M16 17H8M10 9H8"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.totalTests}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Total Tests</span>
              </div>
            </div>
          </div>

          <!-- Passed Card -->
          <div class="hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in stagger-2">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-success-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-success-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-success-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.passed}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Passed</span>
              </div>
              <div class="px-3 py-1 rounded-full text-sm font-semibold bg-success-500/10 text-success-500">
                ${metrics.passRate}%
              </div>
            </div>
          </div>

          <!-- Failed Card -->
          <div class="hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in stagger-3">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-danger-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-danger-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-danger-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.failed}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Failed</span>
              </div>
              <div class="px-3 py-1 rounded-full text-sm font-semibold ${metrics.failed > 0 ? 'bg-danger-500/10 text-danger-500' : 'bg-success-500/10 text-success-500'}">
                ${metrics.failRate}%
              </div>
            </div>
          </div>

          <!-- Skipped Card -->
          <div class="hover-lift bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in stagger-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-warning-500"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-warning-500/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-warning-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12h8"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-3xl font-bold text-slate-900 dark:text-white">${metrics.pending + metrics.skipped}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Skipped</span>
              </div>
              <div class="px-3 py-1 rounded-full text-sm font-semibold bg-warning-500/10 text-warning-500">
                ${metrics.totalTests > 0 ? (((metrics.pending + metrics.skipped) / metrics.totalTests) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Results Chart -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in stagger-3">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Test Results Distribution</h3>
            </div>
            <div class="p-6">
              <div class="chart-container">
                <canvas id="resultsChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Coverage Chart -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in stagger-4">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Test Type Distribution</h3>
            </div>
            <div class="p-6">
              <div class="chart-container">
                <canvas id="coverageChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress & Metrics Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Pass Rate Ring -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center animate-fade-in stagger-4">
            <div class="relative w-40 h-40 mb-6">
              <svg class="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" class="text-slate-200 dark:text-slate-700"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="url(#progressGradient)" stroke-width="8" stroke-linecap="round"
                  class="progress-ring-circle"
                  stroke-dasharray="339.292"
                  stroke-dashoffset="${339.292 - (339.292 * metrics.passRate) / 100}"/>
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#10b981"/>
                    <stop offset="100%" stop-color="#34d399"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-bold gradient-text">${metrics.passRate}%</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Pass Rate</span>
              </div>
            </div>
            <div class="w-full space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-success-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300">Passed: ${metrics.passed}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-danger-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300">Failed: ${metrics.failed}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-warning-500"></span>
                <span class="text-sm text-slate-600 dark:text-slate-300">Skipped: ${metrics.pending + metrics.skipped}</span>
              </div>
            </div>
          </div>

          <!-- Metrics Grid -->
          <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 animate-fade-in stagger-5">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">Execution Metrics</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${this.formatDuration(metrics.duration)}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Total Duration</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${metrics.totalTests > 0 ? this.formatDuration(metrics.duration / metrics.totalTests) : '0ms'}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Avg. per Test</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold text-primary-500 mb-1">${Object.keys(metrics.featureCoverage).length}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Test Suites</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 text-center hover-lift">
                <span class="block text-2xl font-bold ${metrics.passRate >= 90 ? 'text-success-500' : metrics.passRate >= 70 ? 'text-warning-500' : 'text-danger-500'} mb-1">
                  ${metrics.passRate >= 90 ? 'Excellent' : metrics.passRate >= 70 ? 'Good' : 'Needs Work'}
                </span>
                <span class="text-sm text-slate-500 dark:text-slate-400">Health Status</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Test Results Section -->
      <section id="tests" class="section hidden space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Test Results</h2>
          <div class="flex gap-2">
            <button class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white transition-all" data-filter="all">All</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="passed">Passed</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="failed">Failed</button>
            <button class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" data-filter="pending">Skipped</button>
          </div>
        </div>

        <div class="space-y-3">
          ${this.generateTestList(suites)}
        </div>
      </section>

      <!-- Coverage Section -->
      <section id="coverage" class="section hidden space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Feature Coverage</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.generateFeatureCoverageCards(metrics.featureCoverage)}
        </div>
      </section>

    </main>
  </div>

  <script>
    // Register Chart.js plugins
    Chart.register(ChartDataLabels);

    // Theme detection and toggle
    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      html.classList.toggle('dark', !isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      updateCharts();
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (savedTheme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    // Chart colors
    const chartColors = {
      passed: '#10b981',
      failed: '#ef4444',
      pending: '#f59e0b',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      tertiary: '#ec4899',
      quaternary: '#14b8a6',
    };

    // Results Doughnut Chart
    const resultsCtx = document.getElementById('resultsChart').getContext('2d');
    const resultsChart = new Chart(resultsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Skipped'],
        datasets: [{
          data: [${metrics.passed}, ${metrics.failed}, ${metrics.pending + metrics.skipped}],
          backgroundColor: [chartColors.passed, chartColors.failed, chartColors.pending],
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12, family: "'Inter', sans-serif" },
              color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569',
            }
          },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 14 },
            formatter: (value, ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
              return percentage > 5 ? percentage + '%' : '';
            }
          }
        }
      }
    });

    // Coverage Bar Chart
    const coverageCtx = document.getElementById('coverageChart').getContext('2d');
    const coverageChart = new Chart(coverageCtx, {
      type: 'bar',
      data: {
        labels: ['E2E Tests', 'Mock Tests', 'Integration', 'Unit'],
        datasets: [{
          label: 'Tests',
          data: [${metrics.testDistribution.e2e}, ${metrics.testDistribution.mock}, ${metrics.testDistribution.integration}, ${metrics.testDistribution.unit}],
          backgroundColor: [chartColors.primary, chartColors.secondary, chartColors.tertiary, chartColors.quaternary],
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
            font: { weight: 'bold', size: 12 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
            ticks: { color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569' }
          },
          x: {
            grid: { display: false },
            ticks: { color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569' }
          }
        }
      }
    });

    function updateCharts() {
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#94a3b8' : '#475569';
      const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

      resultsChart.options.plugins.legend.labels.color = textColor;
      coverageChart.options.plugins.datalabels.color = isDark ? '#e2e8f0' : '#1e293b';
      coverageChart.options.scales.y.grid.color = gridColor;
      coverageChart.options.scales.y.ticks.color = textColor;
      coverageChart.options.scales.x.ticks.color = textColor;

      resultsChart.update();
      coverageChart.update();
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        const targetId = item.getAttribute('href').substring(1);
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
      });
    });

    // Filter Tests
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active', 'bg-primary-500', 'text-white');
          b.classList.add('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');
        });
        btn.classList.add('active', 'bg-primary-500', 'text-white');
        btn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.test-item').forEach(item => {
          item.style.display = (filter === 'all' || item.classList.contains(filter)) ? 'flex' : 'none';
        });
      });
    });

    // Expand/Collapse Suites
    document.querySelectorAll('.suite-header').forEach(header => {
      header.addEventListener('click', () => {
        const suite = header.closest('.test-suite');
        suite.classList.toggle('expanded');
        const icon = header.querySelector('.toggle-icon');
        icon.style.transform = suite.classList.contains('expanded') ? 'rotate(90deg)' : '';
      });
    });

    // Export Report
    function exportReport() {
      const data = {
        project: '${this.projectName}',
        timestamp: '${new Date().toISOString()}',
        metrics: ${JSON.stringify(metrics)},
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-report-${new Date().toISOString().split('T')[0]}.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
  }

  generateTestList(suites) {
    let html = '';

    const processSuite = (suite, depth = 0) => {
      const tests = suite.tests || [];
      const nestedSuites = suite.suites || [];
      const passedCount = tests.filter((t) => t.pass).length;
      const failedCount = tests.filter((t) => t.fail).length;

      if (suite.title) {
        html += `
          <div class="test-suite bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${depth === 0 ? 'expanded' : ''}" style="margin-left: ${depth * 16}px">
            <div class="suite-header flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
              <svg class="toggle-icon w-4 h-4 text-slate-400 transition-transform ${depth === 0 ? 'rotate-90' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
              <div class="flex-1 flex items-center justify-between">
                <span class="font-semibold text-slate-900 dark:text-white">${suite.title}</span>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-success-500/10 text-success-500">${passedCount}</span>
                  <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-danger-500/10 text-danger-500">${failedCount}</span>
                </div>
              </div>
            </div>
            <div class="suite-content ${depth === 0 ? '' : 'hidden'} px-5 pb-4 space-y-2">
        `;
      }

      tests.forEach((test) => {
        const status = test.pass ? 'passed' : test.fail ? 'failed' : 'pending';
        const duration = test.duration || 0;
        const errorMessage = test.err?.message || '';

        const statusConfig = {
          passed: { bg: 'bg-success-500/10', text: 'text-success-500', icon: '<polyline points="20,6 9,17 4,12"/>' },
          failed: { bg: 'bg-danger-500/10', text: 'text-danger-500', icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
          pending: { bg: 'bg-warning-500/10', text: 'text-warning-500', icon: '<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>' },
        };

        const config = statusConfig[status];

        html += `
          <div class="test-item ${status} flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">
            <div class="w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 ${config.text}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${config.icon}</svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-medium text-slate-900 dark:text-white truncate">${test.title}</span>
              ${errorMessage ? `<span class="block text-xs text-danger-500 font-mono mt-1 truncate">${errorMessage.substring(0, 100)}${errorMessage.length > 100 ? '...' : ''}</span>` : ''}
            </div>
            <span class="text-xs font-mono text-slate-400 flex-shrink-0">${this.formatDuration(duration)}</span>
          </div>
        `;
      });

      nestedSuites.forEach((s) => processSuite(s, depth + 1));

      if (suite.title) {
        html += `
            </div>
          </div>
        `;
      }
    };

    suites.forEach((suite) => processSuite(suite));
    return html || '<p class="text-slate-500 dark:text-slate-400 text-center py-8">No tests found</p>';
  }

  generateFeatureCoverageCards(coverage) {
    let html = '';

    Object.entries(coverage).forEach(([feature, stats]) => {
      const percentage = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(0) : 0;

      const statusConfig = {
        excellent: { gradient: 'from-success-500 to-emerald-400', badge: 'bg-success-500/10 text-success-500' },
        good: { gradient: 'from-info-500 to-blue-400', badge: 'bg-info-500/10 text-info-500' },
        warning: { gradient: 'from-warning-500 to-amber-400', badge: 'bg-warning-500/10 text-warning-500' },
      };

      const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'warning';
      const config = statusConfig[status];

      html += `
        <div class="hover-lift bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-slate-900 dark:text-white truncate pr-2">${feature}</h4>
            <span class="px-3 py-1 rounded-full text-sm font-bold ${config.badge} flex-shrink-0">${percentage}%</span>
          </div>
          <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
            <div class="h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
          </div>
          <div class="flex gap-4 text-xs">
            <span class="text-success-500 font-medium">${stats.passed} passed</span>
            <span class="text-danger-500 font-medium">${stats.failed} failed</span>
            <span class="text-slate-400">${stats.total} total</span>
          </div>
        </div>
      `;
    });

    return html || '<p class="text-slate-500 dark:text-slate-400 text-center py-8 col-span-full">No coverage data</p>';
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

// CLI Usage
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

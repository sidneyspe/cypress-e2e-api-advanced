/**
 * Custom Report Generator for Cypress Tests
 * Generates a modern, interactive HTML dashboard with metrics and charts
 */

const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor(options = {}) {
    this.inputFile = options.inputFile || 'cypress/results/output.json';
    this.outputDir = options.outputDir || 'cypress/results/report';
    this.projectName = options.projectName || 'Hacker Stories';
    this.theme = options.theme || 'dark';
  }

  generate() {
    console.log('🚀 Generating custom test report...');

    const reportData = this.loadReportData();
    if (!reportData) {
      console.error('❌ Failed to load report data');
      return;
    }

    const metrics = this.calculateMetrics(reportData);
    const html = this.generateHTML(reportData, metrics);

    this.ensureOutputDir();
    this.writeReport(html);
    this.copyAssets();

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

    // Calculate coverage by feature
    const featureCoverage = this.calculateFeatureCoverage(suites);

    // Calculate test distribution
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
        features[featureName] = { passed: 0, failed: 0, total: 0 };
      }

      (suite.tests || []).forEach((test) => {
        features[featureName].total++;
        if (test.pass) features[featureName].passed++;
        if (test.fail) features[featureName].failed++;
      });

      (suite.suites || []).forEach(processSuite);
    };

    suites.forEach(processSuite);
    return features;
  }

  calculateTestDistribution(suites) {
    const distribution = {
      unit: 0,
      integration: 0,
      e2e: 0,
      mock: 0,
    };

    const processSuite = (suite, parentPath = '') => {
      const fullPath = parentPath ? `${parentPath}/${suite.file}` : suite.file || '';

      (suite.tests || []).forEach(() => {
        if (fullPath.includes('Mock') || fullPath.includes('mock')) {
          distribution.mock++;
        } else if (fullPath.includes('api') || fullPath.includes('Api')) {
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

  generateHTML(data, metrics) {
    const suites = data.results?.[0]?.suites || [];

    return `<!DOCTYPE html>
<html lang="pt-BR" data-theme="${this.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.projectName} - Test Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
  <style>${this.getStyles()}</style>
</head>
<body>
  <div class="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="project-info">
          <h1>${this.projectName}</h1>
          <span class="badge">Test Report</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a href="#dashboard" class="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </a>
        <a href="#tests" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Test Results
        </a>
        <a href="#coverage" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
          </svg>
          Coverage
        </a>
        <a href="#trends" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 6l-9.5 9.5-5-5L1 18"/>
            <path d="M17 6h6v6"/>
          </svg>
          Trends
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="theme-toggle" onclick="toggleTheme()">
          <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
        <span class="version">v1.0.0</span>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h2>Dashboard</h2>
          <p class="subtitle">Execution Summary</p>
        </div>
        <div class="header-right">
          <div class="execution-info">
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>${this.formatDuration(metrics.duration)}</span>
            </div>
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${new Date(metrics.startTime).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          <button class="btn-export" onclick="exportReport()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </header>

      <!-- Dashboard Section -->
      <section id="dashboard" class="section">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">${metrics.totalTests}</span>
              <span class="stat-label">Total Tests</span>
            </div>
            <div class="stat-trend neutral">
              <span>100%</span>
            </div>
          </div>

          <div class="stat-card passed">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">${metrics.passed}</span>
              <span class="stat-label">Passed</span>
            </div>
            <div class="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
              </svg>
              <span>${metrics.passRate}%</span>
            </div>
          </div>

          <div class="stat-card failed">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">${metrics.failed}</span>
              <span class="stat-label">Failed</span>
            </div>
            <div class="stat-trend ${metrics.failed > 0 ? 'negative' : 'positive'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="${metrics.failed > 0 ? '23,18 13.5,8.5 8.5,13.5 1,6' : '23,6 13.5,15.5 8.5,10.5 1,18'}"/>
              </svg>
              <span>${metrics.failRate}%</span>
            </div>
          </div>

          <div class="stat-card skipped">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">${metrics.pending + metrics.skipped}</span>
              <span class="stat-label">Skipped</span>
            </div>
            <div class="stat-trend neutral">
              <span>${metrics.totalTests > 0 ? (((metrics.pending + metrics.skipped) / metrics.totalTests) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-grid">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Test Results Distribution</h3>
              <div class="chart-legend" id="resultsLegend"></div>
            </div>
            <div class="chart-body">
              <canvas id="resultsChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Test Type Coverage</h3>
              <div class="chart-legend" id="coverageLegend"></div>
            </div>
            <div class="chart-body">
              <canvas id="coverageChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Progress Ring -->
        <div class="progress-section">
          <div class="progress-card">
            <div class="progress-ring-container">
              <svg class="progress-ring" viewBox="0 0 120 120">
                <circle class="progress-ring-bg" cx="60" cy="60" r="54"/>
                <circle class="progress-ring-fill" cx="60" cy="60" r="54"
                  stroke-dasharray="${339.292}"
                  stroke-dashoffset="${339.292 - (339.292 * metrics.passRate) / 100}"/>
              </svg>
              <div class="progress-ring-text">
                <span class="progress-value">${metrics.passRate}%</span>
                <span class="progress-label">Pass Rate</span>
              </div>
            </div>
            <div class="progress-details">
              <div class="progress-detail-item">
                <span class="dot passed"></span>
                <span>Passed: ${metrics.passed}</span>
              </div>
              <div class="progress-detail-item">
                <span class="dot failed"></span>
                <span>Failed: ${metrics.failed}</span>
              </div>
              <div class="progress-detail-item">
                <span class="dot skipped"></span>
                <span>Skipped: ${metrics.pending + metrics.skipped}</span>
              </div>
            </div>
          </div>

          <div class="metrics-card">
            <h3>Execution Metrics</h3>
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">${this.formatDuration(metrics.duration)}</span>
                <span class="metric-label">Total Duration</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">${metrics.totalTests > 0 ? this.formatDuration(metrics.duration / metrics.totalTests) : '0ms'}</span>
                <span class="metric-label">Avg. per Test</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">${Object.keys(metrics.featureCoverage).length}</span>
                <span class="metric-label">Test Suites</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">${metrics.passRate >= 90 ? 'Excellent' : metrics.passRate >= 70 ? 'Good' : 'Needs Work'}</span>
                <span class="metric-label">Health Status</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Test Results Section -->
      <section id="tests" class="section">
        <div class="section-header">
          <h2>Test Results</h2>
          <div class="filter-controls">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="passed">Passed</button>
            <button class="filter-btn" data-filter="failed">Failed</button>
            <button class="filter-btn" data-filter="pending">Skipped</button>
          </div>
        </div>

        <div class="test-list">
          ${this.generateTestList(suites)}
        </div>
      </section>

      <!-- Coverage Section -->
      <section id="coverage" class="section">
        <div class="section-header">
          <h2>Feature Coverage</h2>
        </div>

        <div class="coverage-grid">
          ${this.generateFeatureCoverage(metrics.featureCoverage)}
        </div>
      </section>
    </main>
  </div>

  <script>
    // Chart.js Configuration
    Chart.register(ChartDataLabels);

    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    // Results Doughnut Chart
    const resultsCtx = document.getElementById('resultsChart').getContext('2d');
    new Chart(resultsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Skipped'],
        datasets: [{
          data: [${metrics.passed}, ${metrics.failed}, ${metrics.pending + metrics.skipped}],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
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
    new Chart(coverageCtx, {
      type: 'bar',
      data: {
        labels: ['E2E Tests', 'Mock Tests', 'Integration', 'Unit'],
        datasets: [{
          label: 'Tests',
          data: [${metrics.testDistribution.e2e}, ${metrics.testDistribution.mock}, ${metrics.testDistribution.integration}, ${metrics.testDistribution.unit}],
          backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'],
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
            color: textColor,
            font: { weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });

    // Theme Toggle
    function toggleTheme() {
      const html = document.documentElement;
      const currentTheme = html.dataset.theme;
      html.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', html.dataset.theme);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
    }

    // Filter Tests
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.test-item').forEach(item => {
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        const targetId = item.getAttribute('href').substring(1);
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        document.getElementById(targetId).style.display = 'block';
      });
    });

    // Expand/Collapse Test Suites
    document.querySelectorAll('.suite-header').forEach(header => {
      header.addEventListener('click', () => {
        const suite = header.parentElement;
        suite.classList.toggle('expanded');
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
    }

    // Initial state
    document.querySelectorAll('.section').forEach((s, i) => {
      if (i > 0) s.style.display = 'none';
    });
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
      const totalCount = tests.length;

      if (suite.title) {
        html += `
          <div class="test-suite ${depth === 0 ? 'expanded' : ''}" style="margin-left: ${depth * 20}px">
            <div class="suite-header">
              <div class="suite-toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
              <div class="suite-info">
                <span class="suite-title">${suite.title}</span>
                <div class="suite-stats">
                  <span class="badge-mini passed">${passedCount}</span>
                  <span class="badge-mini failed">${failedCount}</span>
                  <span class="badge-mini total">${totalCount}</span>
                </div>
              </div>
            </div>
            <div class="suite-content">
        `;
      }

      tests.forEach((test) => {
        const status = test.pass ? 'passed' : test.fail ? 'failed' : 'pending';
        const duration = test.duration || 0;
        const errorMessage = test.err?.message || '';

        html += `
          <div class="test-item ${status}">
            <div class="test-status">
              ${
                status === 'passed'
                  ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>'
                  : status === 'failed'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
              }
            </div>
            <div class="test-info">
              <span class="test-title">${test.title}</span>
              ${errorMessage ? `<span class="test-error">${errorMessage}</span>` : ''}
            </div>
            <div class="test-duration">${this.formatDuration(duration)}</div>
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
    return html;
  }

  generateFeatureCoverage(coverage) {
    let html = '';

    Object.entries(coverage).forEach(([feature, stats]) => {
      const percentage =
        stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(0) : 0;
      const status =
        percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'warning';

      html += `
        <div class="coverage-card ${status}">
          <div class="coverage-header">
            <h4>${feature}</h4>
            <span class="coverage-badge">${percentage}%</span>
          </div>
          <div class="coverage-bar">
            <div class="coverage-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="coverage-stats">
            <span class="passed">${stats.passed} passed</span>
            <span class="failed">${stats.failed} failed</span>
            <span class="total">${stats.total} total</span>
          </div>
        </div>
      `;
    });

    return html;
  }

  getStyles() {
    return `
      :root {
        --primary: #6366f1;
        --primary-light: #818cf8;
        --success: #10b981;
        --danger: #ef4444;
        --warning: #f59e0b;
        --info: #3b82f6;

        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --text-muted: #64748b;
        --border: #334155;

        --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
        --shadow-md: 0 4px 6px rgba(0,0,0,0.3);
        --shadow-lg: 0 10px 15px rgba(0,0,0,0.3);
        --shadow-glow: 0 0 20px rgba(99,102,241,0.3);

        --radius-sm: 6px;
        --radius-md: 10px;
        --radius-lg: 16px;
        --radius-xl: 24px;

        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      [data-theme="light"] {
        --bg-primary: #f8fafc;
        --bg-secondary: #ffffff;
        --bg-tertiary: #f1f5f9;
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #94a3b8;
        --border: #e2e8f0;
        --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
        --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
        --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: var(--bg-primary);
        color: var(--text-primary);
        line-height: 1.6;
        overflow-x: hidden;
      }

      .app {
        display: flex;
        min-height: 100vh;
      }

      /* Sidebar */
      .sidebar {
        width: 280px;
        background: var(--bg-secondary);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100vh;
        z-index: 100;
      }

      .sidebar-header {
        padding: 24px;
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-glow);
      }

      .logo svg {
        width: 28px;
        height: 28px;
        color: white;
      }

      .project-info h1 {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .badge {
        display: inline-block;
        padding: 2px 8px;
        background: var(--primary);
        color: white;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 4px;
        margin-top: 4px;
      }

      .sidebar-nav {
        flex: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: var(--transition);
      }

      .nav-item svg {
        width: 20px;
        height: 20px;
      }

      .nav-item:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .nav-item.active {
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
        color: white;
        box-shadow: var(--shadow-glow);
      }

      .sidebar-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .theme-toggle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--bg-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
      }

      .theme-toggle:hover {
        background: var(--primary);
      }

      .theme-toggle svg {
        width: 20px;
        height: 20px;
      }

      [data-theme="dark"] .theme-toggle .sun { display: block; }
      [data-theme="dark"] .theme-toggle .moon { display: none; }
      [data-theme="light"] .theme-toggle .sun { display: none; }
      [data-theme="light"] .theme-toggle .moon { display: block; }

      .version {
        font-size: 12px;
        color: var(--text-muted);
      }

      /* Main Content */
      .main-content {
        flex: 1;
        margin-left: 280px;
        padding: 24px 32px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid var(--border);
      }

      .header h2 {
        font-size: 28px;
        font-weight: 800;
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        color: var(--text-secondary);
        font-size: 14px;
        margin-top: 4px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .execution-info {
        display: flex;
        gap: 24px;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
        font-size: 14px;
      }

      .info-item svg {
        width: 18px;
        height: 18px;
        color: var(--primary);
      }

      .btn-export {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
      }

      .btn-export:hover {
        background: var(--primary-light);
        transform: translateY(-2px);
        box-shadow: var(--shadow-glow);
      }

      .btn-export svg {
        width: 18px;
        height: 18px;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 32px;
      }

      .stat-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        border: 1px solid var(--border);
        transition: var(--transition);
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
      }

      .stat-card.total::before { background: var(--info); }
      .stat-card.passed::before { background: var(--success); }
      .stat-card.failed::before { background: var(--danger); }
      .stat-card.skipped::before { background: var(--warning); }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-card.total .stat-icon { background: rgba(59,130,246,0.15); color: var(--info); }
      .stat-card.passed .stat-icon { background: rgba(16,185,129,0.15); color: var(--success); }
      .stat-card.failed .stat-icon { background: rgba(239,68,68,0.15); color: var(--danger); }
      .stat-card.skipped .stat-icon { background: rgba(245,158,11,0.15); color: var(--warning); }

      .stat-icon svg {
        width: 28px;
        height: 28px;
      }

      .stat-content {
        flex: 1;
      }

      .stat-value {
        display: block;
        font-size: 32px;
        font-weight: 800;
        line-height: 1;
      }

      .stat-label {
        display: block;
        font-size: 14px;
        color: var(--text-secondary);
        margin-top: 4px;
      }

      .stat-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
      }

      .stat-trend svg {
        width: 16px;
        height: 16px;
      }

      .stat-trend.positive { background: rgba(16,185,129,0.15); color: var(--success); }
      .stat-trend.negative { background: rgba(239,68,68,0.15); color: var(--danger); }
      .stat-trend.neutral { background: var(--bg-tertiary); color: var(--text-secondary); }

      /* Charts */
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 32px;
      }

      .chart-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
        overflow: hidden;
      }

      .chart-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chart-header h3 {
        font-size: 16px;
        font-weight: 600;
      }

      .chart-body {
        padding: 24px;
        height: 280px;
      }

      /* Progress Section */
      .progress-section {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 24px;
        margin-bottom: 32px;
      }

      .progress-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
        padding: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .progress-ring-container {
        position: relative;
        width: 160px;
        height: 160px;
      }

      .progress-ring {
        transform: rotate(-90deg);
        width: 100%;
        height: 100%;
      }

      .progress-ring-bg {
        fill: none;
        stroke: var(--bg-tertiary);
        stroke-width: 8;
      }

      .progress-ring-fill {
        fill: none;
        stroke: url(#gradient);
        stroke-width: 8;
        stroke-linecap: round;
        transition: stroke-dashoffset 1s ease-out;
      }

      .progress-ring-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .progress-value {
        display: block;
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(135deg, var(--success), #34d399);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .progress-label {
        font-size: 14px;
        color: var(--text-secondary);
      }

      .progress-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .progress-detail-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: var(--text-secondary);
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .dot.passed { background: var(--success); }
      .dot.failed { background: var(--danger); }
      .dot.skipped { background: var(--warning); }

      .metrics-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
        padding: 32px;
      }

      .metrics-card h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }

      .metric-item {
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        padding: 20px;
        text-align: center;
      }

      .metric-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 4px;
      }

      .metric-label {
        font-size: 13px;
        color: var(--text-secondary);
      }

      /* Test List */
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .section-header h2 {
        font-size: 20px;
        font-weight: 700;
      }

      .filter-controls {
        display: flex;
        gap: 8px;
      }

      .filter-btn {
        padding: 8px 16px;
        background: var(--bg-tertiary);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
      }

      .filter-btn:hover,
      .filter-btn.active {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
      }

      .test-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .test-suite {
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        overflow: hidden;
      }

      .suite-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        cursor: pointer;
        transition: var(--transition);
      }

      .suite-header:hover {
        background: var(--bg-tertiary);
      }

      .suite-toggle svg {
        width: 16px;
        height: 16px;
        color: var(--text-muted);
        transition: transform 0.3s;
      }

      .test-suite.expanded .suite-toggle svg {
        transform: rotate(90deg);
      }

      .suite-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .suite-title {
        font-weight: 600;
        font-size: 15px;
      }

      .suite-stats {
        display: flex;
        gap: 8px;
      }

      .badge-mini {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .badge-mini.passed { background: rgba(16,185,129,0.15); color: var(--success); }
      .badge-mini.failed { background: rgba(239,68,68,0.15); color: var(--danger); }
      .badge-mini.total { background: var(--bg-tertiary); color: var(--text-secondary); }

      .suite-content {
        display: none;
        padding: 0 20px 16px;
      }

      .test-suite.expanded .suite-content {
        display: block;
      }

      .test-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--radius-sm);
        margin-top: 8px;
        background: var(--bg-tertiary);
        transition: var(--transition);
      }

      .test-item:hover {
        transform: translateX(4px);
      }

      .test-status {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .test-item.passed .test-status { background: rgba(16,185,129,0.2); color: var(--success); }
      .test-item.failed .test-status { background: rgba(239,68,68,0.2); color: var(--danger); }
      .test-item.pending .test-status { background: rgba(245,158,11,0.2); color: var(--warning); }

      .test-status svg {
        width: 14px;
        height: 14px;
      }

      .test-info {
        flex: 1;
      }

      .test-title {
        font-size: 14px;
        font-weight: 500;
      }

      .test-error {
        display: block;
        font-size: 12px;
        color: var(--danger);
        margin-top: 4px;
        font-family: 'JetBrains Mono', monospace;
      }

      .test-duration {
        font-size: 12px;
        color: var(--text-muted);
        font-family: 'JetBrains Mono', monospace;
      }

      /* Coverage */
      .coverage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .coverage-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        padding: 20px;
        transition: var(--transition);
      }

      .coverage-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .coverage-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .coverage-header h4 {
        font-size: 15px;
        font-weight: 600;
      }

      .coverage-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
      }

      .coverage-card.excellent .coverage-badge { background: rgba(16,185,129,0.15); color: var(--success); }
      .coverage-card.good .coverage-badge { background: rgba(59,130,246,0.15); color: var(--info); }
      .coverage-card.warning .coverage-badge { background: rgba(245,158,11,0.15); color: var(--warning); }

      .coverage-bar {
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;
      }

      .coverage-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 1s ease-out;
      }

      .coverage-card.excellent .coverage-fill { background: linear-gradient(90deg, var(--success), #34d399); }
      .coverage-card.good .coverage-fill { background: linear-gradient(90deg, var(--info), #60a5fa); }
      .coverage-card.warning .coverage-fill { background: linear-gradient(90deg, var(--warning), #fbbf24); }

      .coverage-stats {
        display: flex;
        gap: 16px;
        font-size: 12px;
      }

      .coverage-stats .passed { color: var(--success); }
      .coverage-stats .failed { color: var(--danger); }
      .coverage-stats .total { color: var(--text-muted); }

      /* Responsive */
      @media (max-width: 1200px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .charts-grid { grid-template-columns: 1fr; }
        .progress-section { grid-template-columns: 1fr; }
      }

      @media (max-width: 768px) {
        .sidebar { width: 100%; height: auto; position: relative; }
        .main-content { margin-left: 0; }
        .stats-grid { grid-template-columns: 1fr; }
        .header { flex-direction: column; gap: 16px; align-items: flex-start; }
      }

      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .stat-card, .chart-card, .progress-card, .metrics-card, .coverage-card {
        animation: fadeIn 0.6s ease-out forwards;
      }

      .stat-card:nth-child(1) { animation-delay: 0.1s; }
      .stat-card:nth-child(2) { animation-delay: 0.2s; }
      .stat-card:nth-child(3) { animation-delay: 0.3s; }
      .stat-card:nth-child(4) { animation-delay: 0.4s; }
    `;
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  writeReport(html) {
    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
  }

  copyAssets() {
    // Copy screenshots and videos if they exist
    const screenshotsDir = 'cypress/screenshots';
    const videosDir = 'cypress/videos';
    const targetScreenshots = path.join(this.outputDir, 'screenshots');
    const targetVideos = path.join(this.outputDir, 'videos');

    if (fs.existsSync(screenshotsDir)) {
      this.copyDir(screenshotsDir, targetScreenshots);
    }

    if (fs.existsSync(videosDir)) {
      this.copyDir(videosDir, targetVideos);
    }
  }

  copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
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

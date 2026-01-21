/**
 * History Manager for Test Execution Reports
 * Handles storage and retrieval of historical execution data
 */

const fs = require('fs');
const path = require('path');

const HISTORY_DIR = 'cypress/results/history';
const HISTORY_INDEX_FILE = path.join(HISTORY_DIR, 'index.json');

class HistoryManager {
  constructor() {
    this.ensureHistoryDir();
  }

  ensureHistoryDir() {
    if (!fs.existsSync(HISTORY_DIR)) {
      fs.mkdirSync(HISTORY_DIR, { recursive: true });
    }
  }

  /**
   * Get the history index containing all execution records
   */
  getIndex() {
    try {
      if (fs.existsSync(HISTORY_INDEX_FILE)) {
        return JSON.parse(fs.readFileSync(HISTORY_INDEX_FILE, 'utf8'));
      }
    } catch (error) {
      console.error('Error reading history index:', error.message);
    }
    return { executions: [] };
  }

  /**
   * Save the history index
   */
  saveIndex(index) {
    try {
      fs.writeFileSync(HISTORY_INDEX_FILE, JSON.stringify(index, null, 2));
    } catch (error) {
      console.error('Error saving history index:', error.message);
    }
  }

  /**
   * Format date as DD/MM/YYYY
   */
  formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Parse DD/MM/YYYY to Date object
   */
  parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Get date key for file naming (YYYY-MM-DD)
   */
  getDateKey(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  /**
   * Save execution to history
   * Only keeps the last execution per day
   */
  saveExecution(executionData) {
    const index = this.getIndex();
    const dateKey = this.getDateKey(executionData.date || new Date());
    const dateFormatted = this.formatDate(executionData.date || new Date());

    // Create execution record
    const execution = {
      id: `exec-${dateKey}-${Date.now()}`,
      date: dateFormatted,
      dateKey: dateKey,
      timestamp: new Date().toISOString(),
      tags: executionData.tags || {},
      summary: {
        total: executionData.total || 0,
        passed: executionData.passed || 0,
        failed: executionData.failed || 0,
        skipped: executionData.skipped || 0,
        passRate: executionData.passRate || 0,
        duration: executionData.duration || 0,
      },
      reportFile: `${dateKey}.json`,
    };

    // Remove previous execution from same day (keep only last)
    index.executions = index.executions.filter((e) => e.dateKey !== dateKey);

    // Add new execution
    index.executions.push(execution);

    // Sort by date descending
    index.executions.sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey));

    // Keep only last 30 days
    const maxDays = 30;
    if (index.executions.length > maxDays) {
      const removed = index.executions.splice(maxDays);
      // Remove old report files
      removed.forEach((exec) => {
        const filePath = path.join(HISTORY_DIR, exec.reportFile);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Save full report data
    const reportPath = path.join(HISTORY_DIR, `${dateKey}.json`);
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          ...execution,
          tests: executionData.tests || [],
          suites: executionData.suites || [],
        },
        null,
        2
      )
    );

    // Save index
    this.saveIndex(index);

    return execution;
  }

  /**
   * Get execution by date (DD/MM/YYYY)
   */
  getExecutionByDate(dateStr) {
    const dateKey = this.getDateKey(this.parseDate(dateStr));
    const reportPath = path.join(HISTORY_DIR, `${dateKey}.json`);

    if (fs.existsSync(reportPath)) {
      return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }
    return null;
  }

  /**
   * Get all execution summaries for history display
   */
  getAllExecutions() {
    const index = this.getIndex();
    return index.executions;
  }

  /**
   * Get execution dates for datepicker
   */
  getAvailableDates() {
    const index = this.getIndex();
    return index.executions.map((e) => ({
      date: e.date,
      dateKey: e.dateKey,
      passRate: e.summary.passRate,
      total: e.summary.total,
    }));
  }

  /**
   * Get latest execution
   */
  getLatestExecution() {
    const index = this.getIndex();
    if (index.executions.length > 0) {
      const latest = index.executions[0];
      return this.getExecutionByDate(latest.date);
    }
    return null;
  }
}

module.exports = HistoryManager;

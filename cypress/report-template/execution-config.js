/**
 * Execution Configuration for Test Reports
 * Defines tags, metadata, and execution context
 */

module.exports = {
  // Squad/Team options
  squads: [
    { id: 'qa-core', name: 'QA Core' },
    { id: 'qa-mobile', name: 'QA Mobile' },
    { id: 'qa-api', name: 'QA API' },
    { id: 'qa-frontend', name: 'QA Frontend' },
    { id: 'qa-performance', name: 'QA Performance' },
    { id: 'devops', name: 'DevOps' },
  ],

  // Execution type options
  executionTypes: [
    { id: 'release', name: 'Release', description: 'Testes de release/deploy' },
    { id: 'regression', name: 'Regressivo', description: 'Testes de regressao completa' },
    { id: 'smoke', name: 'Smoke', description: 'Testes de verificacao rapida' },
    { id: 'sanity', name: 'Sanity', description: 'Testes de sanidade' },
    { id: 'exploratory', name: 'Exploratorio', description: 'Testes exploratorios' },
  ],

  // Product options
  products: [
    { id: 'hacker-stories', name: 'Hacker Stories' },
    { id: 'web-app', name: 'Web App' },
    { id: 'mobile-app', name: 'Mobile App' },
    { id: 'api-gateway', name: 'API Gateway' },
  ],

  // Module options
  modules: [
    { id: 'authentication', name: 'Autenticacao' },
    { id: 'search', name: 'Busca' },
    { id: 'stories', name: 'Stories' },
    { id: 'user-management', name: 'Gestao de Usuarios' },
    { id: 'payments', name: 'Pagamentos' },
    { id: 'notifications', name: 'Notificacoes' },
  ],

  // Functionality type options
  functionalities: [
    { id: 'e2e', name: 'E2E', description: 'Testes End-to-End' },
    { id: 'api', name: 'API', description: 'Testes de API' },
    { id: 'integration', name: 'Integracao', description: 'Testes de Integracao' },
    { id: 'unit', name: 'Unitario', description: 'Testes Unitarios' },
    { id: 'performance', name: 'Performance', description: 'Testes de Performance' },
  ],

  // Default values
  defaults: {
    squad: 'qa-core',
    executionType: 'regression',
    product: 'hacker-stories',
    module: 'stories',
    functionality: 'e2e',
  },

  // History settings
  history: {
    maxDays: 30, // Maximum number of days to keep in history
    storageDir: 'cypress/results/history', // Directory to store historical data
  },
};

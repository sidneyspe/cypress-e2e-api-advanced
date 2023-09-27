const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://wlsf82-hacker-stories.web.app',
    env: {
      hideCredentials: true,
      requestMode: true,
    },
    experimentalRunAllSpecs: true,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
  },
  video: false,
});

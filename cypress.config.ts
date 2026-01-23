import { defineConfig } from 'cypress';
import * as path from 'path';
import * as fs from 'fs';

// Gera ID unico para cada execucao
const generateRunId = () => `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default defineConfig({
  e2e: {
    baseUrl: 'https://wlsf82-hacker-stories.web.app',
    specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 'cypress/api/**/*.cy.{js,jsx,ts,tsx}'],
    supportFile: 'cypress/support/e2e.ts',
    experimentalRunAllSpecs: true,

    setupNodeEvents(on, config) {
      const runId = generateRunId();
      const artifactsDir = path.join('cypress', 'artifacts');

      // Cria diretorio de artefatos para esta execucao
      const runArtifactsDir = path.join(artifactsDir, 'screenshots', runId);
      const runVideosDir = path.join(artifactsDir, 'videos', runId);

      fs.mkdirSync(runArtifactsDir, { recursive: true });
      fs.mkdirSync(runVideosDir, { recursive: true });

      // Task para obter o runId
      on('task', {
        getRunId() {
          return runId;
        },

        log(message: string) {
          console.log(message);
          return null;
        },
      });

      // Processa screenshots
      on('after:screenshot', (details) => {
        const screenshotRunDir = path.join(runArtifactsDir, details.specName);
        fs.mkdirSync(screenshotRunDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFileName = `${details.name || 'screenshot'}--${timestamp}.png`;
        const newPath = path.join(screenshotRunDir, newFileName);

        fs.renameSync(details.path, newPath);

        return { path: newPath };
      });

      // Processa videos
      on('after:spec', (spec, results) => {
        if (results?.video) {
          const videoFileName = path.basename(results.video);
          const newVideoPath = path.join(runVideosDir, videoFileName);

          fs.renameSync(results.video, newVideoPath);
        }
      });

      // Reporter config
      config.reporter = 'cypress-multi-reporters';
      config.reporterOptions = {
        configFile: 'reporter-config.json',
      };

      return config;
    },
  },

  // Configuracoes de video e screenshot
  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/artifacts/screenshots',
  videosFolder: 'cypress/artifacts/videos',
  trashAssetsBeforeRuns: false,

  // Configuracoes de retry
  retries: {
    runMode: 2,
    openMode: 0,
  },

  // Timeouts
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  requestTimeout: 10000,
  responseTimeout: 30000,

  // Viewport padrao
  viewportWidth: 1280,
  viewportHeight: 720,

  // Configuracoes de ambiente
  env: {
    apiUrl: 'https://hn.algolia.com/api/v1',
    hideCredentials: true,
    requestMode: true,
  },
});

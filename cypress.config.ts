import { defineConfig } from 'cypress';
import registerCodeCoverageTasks from '@cypress/code-coverage/task';
import coverageWebpack from './cypress/coverage.webpack';
import cypressSplit from 'cypress-split';

export default defineConfig({
  projectId: '36s7kj',

  retries: {
    runMode: 2,
    openMode: 0
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      cypressSplit(on, config);
      return config;
    }
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      webpackConfig: coverageWebpack
    },
    specPattern: '**/*.cy.ts',
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      cypressSplit(on, config);
      return config;
    }
  }
});


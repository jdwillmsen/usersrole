import { defineConfig } from 'cypress';
import registerCodeCoverageTasks from '@cypress/code-coverage/task';
import coverageWebpack from './cypress/coverage.webpack';
import cypressSplit from 'cypress-split';

export default defineConfig({
  projectId: 'rjyumo',

  retries: {
    runMode: 2,
    openMode: 0
  },

  // reporter: 'mochawesome',
  // reporterOptions: {
  //   useInlineDiffs: true,
  //   embeddedScreenshots: true,
  //   reportDir: 'cypress/results',
  //   reportFilename: '[name].html',
  //   overwrite: true,
  //   html: true,
  //   json: true
  // },

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


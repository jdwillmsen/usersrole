import { defineConfig } from 'cypress'
import fs from 'fs'

export default defineConfig({
  projectId: 'pxwdhj',
  
  e2e: {
    'baseUrl': 'http://localhost:4200',
    setupNodeEvents(on, config) {
      on(
        'after:spec',
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results && results.video) {
            // Do we have failures for any retry attempts?
            const failures = results.tests.some((test) =>
              test.attempts.some((attempt) => attempt.state === 'failed')
            )
            if (!failures) {
              // delete the video if the spec passed and no tests retried
              fs.unlinkSync(results.video)
            }
          }
        }
      )
    },
  },
  
  
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  },
})
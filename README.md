# [Users Role](https://usersrole.web.app/) 

[![Jest](https://github.com/jdwillmsen/usersrole/actions/workflows/jest.yml/badge.svg?branch=develop)](https://github.com/jdwillmsen/usersrole/actions/workflows/jest.yml)
[![Lint](https://github.com/jdwillmsen/usersrole/actions/workflows/lint.yml/badge.svg)](https://github.com/jdwillmsen/usersrole/actions/workflows/lint.yml)
[![Format](https://github.com/jdwillmsen/usersrole/actions/workflows/format.yml/badge.svg)](https://github.com/jdwillmsen/usersrole/actions/workflows/format.yml)
[![CodeQL](https://github.com/jdwillmsen/usersrole/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/jdwillmsen/usersrole/actions/workflows/github-code-scanning/codeql)
[![Cypress Component Tests](https://github.com/jdwillmsen/usersrole/actions/workflows/cypress-component.yml/badge.svg)](https://github.com/jdwillmsen/usersrole/actions/workflows/cypress-component.yml)
[![Cypress E2E Tests](https://github.com/jdwillmsen/usersrole/actions/workflows/cypress-e2e.yml/badge.svg)](https://github.com/jdwillmsen/usersrole/actions/workflows/cypress-e2e.yml)
[![Code Coverage](https://github.com/jdwillmsen/usersrole/actions/workflows/code-coverage.yml/badge.svg?branch=develop)](https://github.com/jdwillmsen/usersrole/actions/workflows/code-coverage.yml)
![check-code-coverage](https://img.shields.io/badge/code--coverage-95.07%25-brightgreen)

This is a frontend application that is supposed to provide a template for
users authentication and authorization since these are common features to be
used in most applications. It also includes features such as theme
selection, snackbar service, alerts service, and a general site layout with
header, collapsable sidebar/navigation, and main content area. This
application is all a Progressive Web App (PWA) and can be downloaded as an app
on mobile and desktop devices.

The authentication is provided by Firebase with Google Identity Platform and
the authorization is built off of a node server that makes use of Firebase
functions. The production server and all deployments are hosted with
Firebase hosting.

The CI/CD tools used here are GitHub actions. There are two different
actions/workflows for CD, one for deploying production and the other for raising
previews during pull requests. As well as few other checks within GitHub
(CodeQL). Also, there is a server.js script in the repo that is used within
CI/CD to retrieve and set up the environment file since they contain secrets.
Which are managed with GitHub secrets. For CI there are also various different
actions for lint, format, jest (unit) tests, cypress (component, E2E) tests,
and code coverage.

## Development server

Run `ng serve` for a dev server.\
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.\
Run `firebase deploy` to upload the latest snapshot to the firebase servers.\
Run `firebase hosting:channel:deploy` to create and deploy a preview channel.

## Code scaffolding

Run `ng generate component [module-folder]/components/component-name --standalone` to generate a new component.\
Run `ng generate service [module-folder]/services/service-name` to generate a new service.\
You can also use `ng generate directive|pipe|class|guard|interface|enum|module`.

### Cypress scaffolding

Running `ng generate component component-name` will generate Cypress component test instead of default karma testing
file. This is due to the Cypress scaffolding declared in angular.json

## Code Structure

- src
  - app
    - modules
      - components
      - services
      - etc
    - shared
      - components
      - models
    - core
      - guards
      - interceptors
      - models
      - services

The current code base is split it feature modules with there also being a shared module and a core module.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Format

Run `npm run format` to format via [Prettier](https://prettier.io/)

## Testing

### Running lint test

Run `npm run lint` or `ng lint` to execute the lint testing via [ESLint](https://eslint.org/)

### Running unit tests

Run `npm run jest` to execute the unit tests via [Jest](https://jestjs.io/).

### Running component tests

Run `npm run ct` to execute component tests in watch mode.\
Run `npm run ct:ci` to execute component tests in headless mode.\
The component tests are making use of a testing framework called [Cypress](https://docs.cypress.io/guides/component-testing/overview).

### Running end-to-end tests

Run `npm run e2e` to execute e2e tests in watch mode.\
Run `npm run e2e:ci` to execute e2e tests in headless mode.\
The e2e tests are making use of a testing framework called [Cypress](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test).

#### Setup test accounts

In order to run the tests you will have to set up the accounts.json fixture:

```json
{
  "basic": {
    "uid": "rxF10vvSpTSWHQfD5FACZVGP8mm1",
    "email": "cicd-basic-account@usersrole.com",
    "displayName": "CICD Basic Account",
    "password": "password here",
    "roles": [
      "user"
    ]
  },
  "read": {
    "uid": "r8MaoGbXzKSSFMQyBcdsN7Ed4t82",
    "email": "cicd-read-account@usersrole.com",
    "displayName": "CICD Read Account",
    "password": "password here",
    "roles": [
      "user",
      "read"
    ]
  },
  "manager": {
    "uid": "erRZHm1V63Sm13kUcmL2sH7i6cw2",
    "email": "cicd-manager-account@usersrole.com",
    "displayName": "CICD Manager Account",
    "password": "password here",
    "roles": [
      "user",
      "manager"
    ]
  },
  "admin": {
    "uid": "5O7R7eMdk8ZfhP5MeF6VDAzrXn13",
    "email": "cicd-admin-account@usersrole.com",
    "displayName": "CICD Admin Account",
    "password": "password here",
    "roles": [
      "user",
      "admin"
    ]
  }
}
```

This will go in the cypress/fixtures folder and is not included in the repository for security reasons.

## Code Coverage

Code coverage will appear in the `coverage` folder in a structure like:

- cypress-and-jest
  - coverage
    - .nyc_output
    - cypress
    - jest
    - merged-report

`.nyc_output` is the temporary directory where instrumented code output is placed.\
`cypress` is the directory where the coverage information/reports are for component and e2e tests.\
`jest` is the directory where the coverage information/reports are for the jest/unit tests.\
`merged-report` is the directory where the combine information/reports of jest, component, and e2e tests

** Currently the merge code coverage report does not correctly combine all the reports. Hence the overall coverage is actually higher than the number listed.

### Coverage commands

Run `npm run jest:coverage` to get the unit tests coverage report.\
Run `npm run cypress:coverage` to get the cypress tests (component and e2e) report.\
Run `npm run all:coverage` to get the combined report (jest and cypress).

## Project Info

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

Production URL: https://usersrole.web.app/

### Code Standards

Conventions followed for this project:

- Data tags `data-*` should be kebab-case
- For Cypress component & e2e testing use `data-cy` data tags

### Developers

- Jake Willmsen

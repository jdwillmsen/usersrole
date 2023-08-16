# Users Role

This is a frontend application that is supposed to provided a template for users authentication and authorization since these are common features to be used in most applications. It also includes features such as theme selection, snackbar service, alerts service, and a general site layout with header, collapsable sidebar/navigation, and main content area.

The authentication is provided by Firebase with Google Identity Platform and the authorization is built off of a node server that makes use of Firebase functions. The production server and all deployments are hosted with Firebase hosting.

The CI/CD tools used here are GitHub actions. There are two different actions/workflows, one for deploying production and the other for raising previews during pull requests. As well as few other checks within GitHub (CodeQL). Also there is a server.js script in the repo that is used within CI/CD to retrieve and setup the environment file since they contain secrets. Which are managed with GitHub secrets.

### Project Details

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Cypress scaffolding

Running `ng generate component component-name` will generate Cypress component test instead of default karma testing file. This is due to the Cypress scaffolding declared in angular.json

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://jestjs.io/).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/)

### Configuration:
--watch (true/false) runs cypress testing in headless mode if false else runs in Cypress app

## Running component test

Run `npm run ct` or `npx cypress open --component` to execute the cypress component tests in watch mode via [Cypress](https://docs.cypress.io/guides/component-testing/overview)

## Running lint test

Run `ng lint` or npm run lint to execute the lint testing via [ESLint](https://eslint.org/)

## Deployment

Run `firebase deploy` to upload the latest snapshot to the firebase servers. Run `firebase hosting:channel:deploy` to create and deploy a preview channel.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

## Endpoints
- Get all products: https://zzvdqullrj.execute-api.eu-central-1.amazonaws.com/dev/products
- Get product by Id: https://zzvdqullrj.execute-api.eu-central-1.amazonaws.com/dev/products/p1

### Local Testing

In order to test the functions locally, run the following commands:

- ```npm run local:get-product-by-id```
- ```npm run local:get-products```

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Unit tests

In order to run unit tests, run the ```npm run test```.

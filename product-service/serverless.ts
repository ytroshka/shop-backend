import type { AWS } from '@serverless/typescript';
import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-dotenv-plugin', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: '${self:custom.productsTable}',
      STOCKS_TABLE: '${self:custom.stocksTable}',
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      packager: 'npm',
      includeModules: true,
    },
    productsTable: 'products',
    stocksTable: 'stocks',
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.productsTable}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PROVISIONED',
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.stocksTable}',
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PROVISIONED',
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;

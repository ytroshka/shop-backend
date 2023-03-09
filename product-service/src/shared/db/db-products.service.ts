import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Product, ProductItem } from '../model/product';
import { StockItem } from '../model/stocks';

export class DbProductsService {
  private readonly dynamoDb: DocumentClient;

  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  async createProduct(product: Product): Promise<void> {
    try {
      const productsParams = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
          id: product.id,
          title: product.title,
          description: product.description || '',
          price: product.price,
        },
      };

      const stocksParams = {
        TableName: process.env.STOCKS_TABLE,
        Item: {
          product_id: product.id,
          count: product.count,
        },
      };

      // Transaction based creation of product
      const transactionParams = {
        TransactItems: [
          {
            Put: productsParams,
          },
          {
            Put: stocksParams,
          },
        ],
      };
      await this.dynamoDb.transactWrite(transactionParams).promise();
    } catch (error) {
      throw new Error(`DB Error: ${error}`);
    }
  }

  async getProductsById(productId: string): Promise<Product> {
    try {
      const productsParams = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
          id: productId,
        },
      };

      const { Item: product } = await this.dynamoDb
        .get(productsParams)
        .promise();

      if (!product) {
        return null;
      }

      const stocksParams = {
        TableName: process.env.STOCKS_TABLE,
        Key: {
          product_id: productId,
        },
      };
      const { Item: stockItem } = await this.dynamoDb
        .get(stocksParams)
        .promise();

      return {
        ...(product as ProductItem),
        count: (stockItem as StockItem).count,
      };
    } catch (error) {
      throw new Error(`DB Error: ${error}`);
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const productsParams = {
        TableName: process.env.PRODUCTS_TABLE,
      };

      const stocksParams = {
        TableName: process.env.STOCKS_TABLE,
      };

      const { Items: products } = await this.dynamoDb
        .scan(productsParams)
        .promise();
      const { Items: stocks } = await this.dynamoDb
        .scan(stocksParams)
        .promise();

      return (products as ProductItem[]).map(product => {
        const stockItem = (stocks as StockItem[]).find(
          stock => stock.product_id === product.id,
        );
        return {
          ...product,
          count: stockItem.count,
        };
      });
    } catch (error) {
      throw new Error(`DB Error: ${error}`);
    }
  }
}

import { DbProductsService } from '../../shared/db/db-products.service';
import { validateProduct } from '../../shared/helpers/product-validator';
import { Product } from '../../shared/model/product';
import { v4 } from 'uuid';
import { SNS } from 'aws-sdk';

const dbService = new DbProductsService();
const sns = new SNS({ region: 'eu-central-1' });

export const catalogBatchProcess = async event => {
  try {
    console.log('Event:', JSON.stringify(event));

    for (const record of event.Records) {
      const product: Product = JSON.parse(record.body);

      const validationMessages = validateProduct(product);

      if (validationMessages.length) {
        console.log('Error:', product, validationMessages.join('; '));
        return null;
      }

      product.id = v4();

      await dbService.createProduct(product);

      await sns
        .publish({
          Message: `New product was added: ${JSON.stringify(product, null, 2)}`,
          TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
          MessageAttributes: {
            attributePrice: {
              DataType: 'Number',
              StringValue: String(product.price),
            },
          },
        })
        .promise();
    }
    console.log('Products successfully created');
  } catch (e) {
    console.log('Error:', e);
  }
};

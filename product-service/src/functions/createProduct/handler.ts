import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { DbProductsService } from '../../shared/db/db-products.service';
import { validateProduct } from '../../shared/helpers/product-validator';
import { Product } from '../../shared/model/product';
import { v4 } from 'uuid';

const dbService = new DbProductsService();

export const createProduct = async (event) => {
  try {
    console.log('Event:', event)

    const product: Product = JSON.parse(event.body);

    const validationMessages = validateProduct(product);

    if (validationMessages.length) {
      return formatJSONResponseError(
        { message: validationMessages.join('; ') },
        400,
      );
    }

    product.id = v4();

    await dbService.createProduct(product);

    return formatJSONResponse(
      {
        ...product,
        count: product.count,
      },
      201,
    );
  } catch (e) {
    console.log('Error:', e.message)

    return formatJSONResponseError({
      message: e.message,
    });
  }
};

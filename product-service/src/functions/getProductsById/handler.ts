import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { DbProductsService } from '../../shared/db/db-products.service';

const dbService = new DbProductsService();

export const getProductsById = async (event) => {
  try {
    console.log('Event:', event)

    const productId = event?.pathParameters?.productId;

    const product = await dbService.getProductsById(productId);

    if (!product) {
      return formatJSONResponseError({ message: 'Product not found!' }, 404);
    }

    return formatJSONResponse(product);
  } catch (e) {
    console.log('Error:', e.message)

    return formatJSONResponseError({
      message: e.message,
    });
  }
};

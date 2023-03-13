import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { DbProductsService } from '../../shared/db/db-products.service';

const dbService = new DbProductsService();

export const getProductsList = async (event) => {
  try {
    console.log('Event:', event)

    const products = await dbService.getProducts();

    return formatJSONResponse(products);
  } catch (e) {
    console.log('Error:', e.message)

    return formatJSONResponseError({
      message: e.message,
    });
  }
};

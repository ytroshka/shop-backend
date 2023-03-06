import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { products } from '../../shared/data/products';

export const getProductsList = async () => {
  try {
    return await new Promise(resolve =>
      setTimeout(() => resolve(formatJSONResponse(products)), 100),
    );
  } catch (e) {
    return formatJSONResponseError({
      message: e.message,
    });
  }
};

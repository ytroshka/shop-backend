import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { products } from '../../shared/data/products';

export const getProductsById = async event => {
  try {
    const productId = event?.pathParameters?.productId;
    const product = await new Promise(resolve =>
      setTimeout(
        () => resolve(products.find(item => item.id === productId)),
        100,
      ),
    );
    if (!product) {
      return formatJSONResponseError({ message: 'Product not found!' }, 404);
    }
    return formatJSONResponse(product);
  } catch (e) {
    return formatJSONResponseError({
      message: e.message,
    });
  }
};

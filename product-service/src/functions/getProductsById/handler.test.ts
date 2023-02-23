import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { getProductsById } from './handler';
import { products } from '../../shared/data/products';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn(),
  formatJSONResponseError: jest.fn(),
}));

describe('getProductsById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should resolve with a JSON response containing a product', async () => {
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(products[0]),
    };
    (formatJSONResponse as jest.Mock).mockReturnValue(expectedResponse);
    const response = await getProductsById({
      pathParameters: { productId: 'p1' },
    });
    expect(response).toEqual(expectedResponse);
    expect(formatJSONResponse).toHaveBeenCalledWith(products[0]);
    expect(formatJSONResponseError).not.toHaveBeenCalled();
  });

  it('should return an not found error if there is no product', async () => {
    const errorMessage = 'Product not found!';
    const expectedResponse = {
      statusCode: 404,
      body: { message: errorMessage },
    };
    (formatJSONResponseError as jest.Mock).mockReturnValue(expectedResponse);
    const response = await getProductsById({
      pathParameters: { productId: '000' },
    });
    expect(response).toEqual(expectedResponse);
    expect(formatJSONResponse).not.toHaveBeenCalled();
    expect(formatJSONResponseError).toHaveBeenCalledWith(
      { message: errorMessage },
      404,
    );
  });

  it('should reject with an error message if an error occurs', async () => {
    const errorMessage = 'An error occurred!';
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
    (formatJSONResponseError as jest.Mock).mockReturnValue(expectedResponse);
    jest.spyOn(global, 'setTimeout').mockImplementation(() => {
      throw new Error(errorMessage);
    });
    try {
      await getProductsById({ pathParameters: { productId: 'p1' } });
    } catch (e) {
      expect(e).toEqual(expectedResponse);
      expect(formatJSONResponse).not.toHaveBeenCalled();
      expect(formatJSONResponseError).toHaveBeenCalledWith(
        { message: errorMessage },
        500,
      );
    }
    jest.restoreAllMocks();
  });
});

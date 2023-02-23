import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { getProductsList } from './handler';
import { products } from '../../shared/data/products';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn(),
  formatJSONResponseError: jest.fn(),
}));

describe('getProductsList', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should resolve with a JSON response containing the list of products', async () => {
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(products),
    };
    (formatJSONResponse as jest.Mock).mockReturnValue(expectedResponse);
    const response = await getProductsList();
    expect(response).toEqual(expectedResponse);
    expect(formatJSONResponse).toHaveBeenCalledWith(products);
    expect(formatJSONResponseError).not.toHaveBeenCalled();
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
      await getProductsList();
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

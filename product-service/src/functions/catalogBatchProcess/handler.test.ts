import { catalogBatchProcess } from './handler';

const product = {
  title: 'Test Product',
  description: 'This is a test product',
  price: 9.99,
  count: 10,
};

jest.mock('../../shared/db/db-products.service', () => {
  const product = {
    title: 'Test Product',
    description: 'This is a test product',
    price: 9.99,
    count: 10,
  };

  const mockedDB = {
    createProduct: jest
      .fn()
      .mockResolvedValueOnce({ ...product, id: 'id' })
      .mockRejectedValueOnce(new Error('Error')),
  };

  return {
    DbProductsService: jest.fn(() => mockedDB),
  };
});

jest.mock('aws-sdk', () => {
  const mockedSNS = {
    publish: () => ({ promise: () => {} }),
  };

  return {
    SNS: jest.fn(() => mockedSNS),
  };
});

describe('catalogBatchProcess', () => {
  it('should create products and publish messages', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const event = {
      Records: [
        {
          body: JSON.stringify(product),
        },
      ],
    };
    await catalogBatchProcess(event);
    expect(consoleSpy).toHaveBeenCalledWith('Products successfully created');
  });

  it('should not product create because of validation issue', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const event = {
      Records: [
        {
          body: JSON.stringify({ ...product, title: null }),
        },
      ],
    };
    await catalogBatchProcess(event);
    expect(consoleSpy).toHaveBeenCalledWith('Error:', { ...product, title: null }, 'Title is required');
  });
});

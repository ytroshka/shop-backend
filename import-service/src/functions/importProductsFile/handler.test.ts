import { importProductsFile } from './handler';

jest.mock('aws-sdk', () => {
  const mockedS3 = {
    getSignedUrlPromise: jest
      .fn()
      .mockReturnValueOnce('https://example.com')
      .mockRejectedValueOnce(new Error('Error')),
  };

  return {
    S3: jest.fn(() => mockedS3),
  };
});

describe('importProductsFile', () => {
  it('returns a signed URL for uploading a CSV file to S3', async () => {
    const event = {
      queryStringParameters: {
        name: 'example.csv',
      },
    };

    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('"https://example.com"');
  });

  it('returns an error message if an error occurs', async () => {
    const event = {
      queryStringParameters: {
        name: 'example.csv',
      },
    };

    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual('{"message":"Error"}');
  });
});

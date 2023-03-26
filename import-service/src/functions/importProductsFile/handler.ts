import { formatJSONResponse, formatJSONResponseError } from '@libs/api-gateway';
import { S3 } from 'aws-sdk';

export const importProductsFile = async event => {
  try {
    console.log('Event:', event);
    const { name } = event.queryStringParameters;
    const s3 = new S3({ region: 'eu-central-1' });

    const params = {
      Bucket: process.env.BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return formatJSONResponse(url);
  } catch (e) {
    console.log('Error:', e.message);
    return formatJSONResponseError({
      message: e.message,
    });
  }
};

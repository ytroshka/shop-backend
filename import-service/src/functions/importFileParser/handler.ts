import { S3 } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

export const importFileParser = async (event: S3Event): Promise<number> => {
  try {
    console.log('Event:', event);
    const s3 = new S3({ region: 'eu-central-1' });
    const bucket = process.env.BUCKET;

    const [record] = event.Records;
    const { key } = record.s3.object;

    const params = {
      Bucket: bucket,
      Key: key,
    };

    console.log('Start:', key);

    const stream = s3.getObject(params).createReadStream().pipe(csv());

    for await (const data of stream) {
      console.log(data);
    }

    console.log('Finish:', key);

    await s3
      .copyObject({
        Bucket: bucket,
        CopySource: `${bucket}/${key}`,
        Key: key.replace('uploaded', 'parsed'),
      })
      .promise();

    console.log('Copied:', key);

    await s3.deleteObject(params).promise();

    console.log('Deleted:', key);

    return 200;
  } catch (error) {
    console.log('Something went wrong. Error:', error);

    return 500;
  }
};

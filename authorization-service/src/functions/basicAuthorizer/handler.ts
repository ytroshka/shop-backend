export const basicAuthorizer = async (event, _context, callback) => {
  console.log('Event:', event);

  const { authorizationToken, methodArn } = event;

  if (!authorizationToken) {
    throw new Error('Unauthorized');
  }

  const encodedCredentials = authorizationToken.split(' ')[1];
  const [username, password] = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

  const expectedPassword = process.env[username];
  if (!expectedPassword || expectedPassword !== password) {
    return callback(null, generatePolicy(username, 'Deny', methodArn));
  }

  return callback(null, generatePolicy(username, 'Allow', methodArn));
};

function generatePolicy(principalId: string, effect: 'Deny' | 'Allow', resource: string) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

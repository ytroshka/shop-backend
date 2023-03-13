export const formatJSONResponse = (response, statusCode = 200) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
    body: JSON.stringify(response),
  };
};

export const formatJSONResponseError = (
  response: Record<string, unknown>,
  statusCode = 500,
) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
    body: JSON.stringify(response),
  };
};

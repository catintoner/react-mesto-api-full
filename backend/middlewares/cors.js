const { DEFAULT_ALLOWED_METHODS, allowedCors } = require('../utils/constants');

module.exports = function cors(request, response, next) {
  const { method } = request;
  const { origin } = request.headers;
  const requestHeaders = request.headers['access-control-request-headers'];
  response.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    response.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    response.header('Access-Control-Allow-Headers', requestHeaders);
    return response.end();
  }
  return next();
};

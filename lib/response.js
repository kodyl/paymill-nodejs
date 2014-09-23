'use strict';

var RESPONSE_MESSAGES = require('./response_codes');

// Handle errors
function getResponseCodeMessage (res) {
  var responseCode = res.data && res.data.response_code;
  var responseMessage = 'Unknown error.';

  if (typeof responseCode === 'number') {
    return RESPONSE_MESSAGES[responseCode] || responseMessage;
  }

  // Other cases ?

  return responseMessage;
}


// Response handler
function responseHandler (req, callback) {
  req.on('response', function (res) {
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      var err = null;
      try {
        data = JSON.parse(data);
        if (res.statusCode !== 200) {
          err = new Error(getResponseCodeMessage(data));
          err.response = data;
          data = null;
        }
      }
      catch (e) {
        err = new Error('Invalid JSON from Paymill API');
        data = null;
      }
      callback(err, data);
    });
  });

  req.on('error', callback);
}

module.exports = responseHandler;

/*
We’ve build a RESTful API - that’s the reason why we are concerned about correct status codes which are returned as JSON objects. But in some cases we don’t have the same syntax as the normal http response has. The basic status codes are:

2xx indicates a successful request
4xx informs you about an error
5xx tells you that we did something wrong
Note

Do not just check the HTTP status code 2xx to verify a successful request, also check the expecting message information, for example transactions or refunds include a response code.

200 OK
  Great, go ahead.
401 Unauthorized
  Jim, You have to provide your private API Key.
403 Transaction Error
  Transaction could not be completed, please check your payment data.
404 Not Found
  There is no entity with this identifier, did you use the right one?
412 Precondition Failed
  I guess you’re missing at least one required parameter?
5xx Server Error
  Doh, we did something wrong :/
*/

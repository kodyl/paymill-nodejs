/* Copyright 2014 Daniel Juhl, see LICENSE */
'use strict';

var https = require('https');
var querystring = require('querystring');
var Promise = require('bluebird');

var responseHandler = require('./response');

// Constructor
function Paymill (apiKey, apiVersion) {
  apiVersion = apiVersion || 'v2.1';

  var authToken = 'Basic ' + new Buffer(apiKey + ':').toString('base64');

  // Request handler
  function request (method, endpoint, data, callback) {
    return new Promise(function (resolve, reject) {
      var payload = '';
      var pathname = ['/', apiVersion, endpoint].join('');

      var dataKeys = Object.keys(data);

      dataKeys.forEach(function (key) {
        if (typeof data[key] === 'object' && data[key] !== null) {
          var obj = data[key];
          delete data[key];
          Object.keys(obj).forEach(function (subKey) {
            data[key + '[' + subKey + ']'] = obj[subKey];
          });
        }
      });

      if (method === 'GET' && dataKeys.length) {
        pathname += '?' + querystring.stringify(data);
      }
      else {
        payload = querystring.stringify(data);
      }

      var options = {
        host: 'api.paymill.com',
        port: '443',
        path: pathname,
        method: method,
        headers: {
          'Authorization': authToken,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': payload.length
        }
      };

      var req = https.request(options);
      responseHandler(req, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
      if (payload) {
        req.write(payload);
      }
      req.end();
    }).nodeify(callback);
  }

  // Request method shorthands
  function get(path, data, callback) {
    return request('GET', path, data, callback);
  }

  function post(path, data, callback) {
    return request('POST', path, data, callback);
  }

  function put(path, data, callback) {
    return request('PUT', path, data, callback);
  }

  function del(path, data, callback) {
    return request('DELETE', path, data, callback);
  }

  // Validate string
  function validateId (variable, label) {
    if (typeof variable !== 'string') {
      throw new TypeError((label || 'argument') + ' must be a string');
    }
  }

  // API endpoints
  var endpoints = {
    // clients
    clients: {
      create: function (client, cb) {
        return post('/clients', client, cb);
      },
      list: function (data, cb) {
        return get('/clients', data, cb);
      },
      details: function (clientId, cb) {
        validateId(clientId, 'clientId');
        return get('/clients/' + clientId, {}, cb);
      },
      update: function (clientId, data, cb) {
        validateId(clientId, 'clientId');
        return put('/clients/' + clientId, data, cb);
      },
      remove: function (clientId, cb) {
        validateId(clientId, 'clientId');
        return del('/clients/' + clientId, {}, cb);
      }
    },
    // offers
    offers: {
      create: function (offer, cb) {
        return post('/offers', offer, cb);
      },
      list: function (data, cb) {
        return get('/offers', data, cb);
      },
      details: function (offerId, cb) {
        validateId(offerId, 'offerId');
        return get('/offers/' + offerId, {}, cb);
      },
      update: function (offerId, data, cb) {
        validateId(offerId, 'offerId');
        return put('/offers/' + offerId, data, cb);
      },
      remove: function (offerId, cb) {
        validateId(offerId, 'offerId');
        return del('/offers/' + offerId, {}, cb);
      }
    },
    // payments
    payments: {
      create: function (payment, cb) {
        return post('/payments', payment, cb);
      },
      list: function (data, cb) {
        return get('/payments', data, cb);
      },
      details: function (paymentId, cb) {
        validateId(paymentId, 'paymentId');
        return get('/payments/' + paymentId, {}, cb);
      },
      remove: function (paymentId, cb) {
        validateId(paymentId, 'paymentId');
        return del('/payments/' + paymentId, {}, cb);
      }
    },
    // preauthorizations
    preauthorizations: {
      create: function (preauthorization, cb) {
        return post('/preauthorizations', preauthorization, cb);
      },
      list: function (data, cb) {
        return get('/preauthorizations', data, cb);
      },
      details: function (preauthorizationId, cb) {
        validateId(preauthorizationId, 'preauthorizationId');
        return get('/preauthorizations/' + preauthorizationId, {}, cb);
      },
      remove: function (preauthorizationId, cb) {
        validateId(preauthorizationId, 'preauthorizationId');
        return del('/preauthorizations/' + preauthorizationId, {}, cb);
      }
    },
    // refunds
    refunds: {
      create: function (transactionId, amount, description, cb) {
        if (!cb && typeof description === 'function') {
          cb = description;
          description = '';
        }
        var data = typeof amount === 'object' ? amount : {amount: amount, description: description};
        return post('/refunds/' + transactionId, data, cb);
      },
      list: function (data, cb) {
        return get('/refunds', data, cb);
      },
      details: function (refundId, cb) {
        validateId(refundId, 'refundId');
        return get('/refunds/' + refundId, {}, cb);
      }
    },
    // subscriptions
    subscriptions: {
      create: function (subscription, cb) {
        return post('/subscriptions', subscription, cb);
      },
      list: function (data, cb) {
        return get('/subscriptions', data, cb);
      },
      details: function (subscriptionId, cb) {
        validateId(subscriptionId, 'subscriptionId');
        return get('/subscriptions/' + subscriptionId, {}, cb);
      },
      update: function (subscriptionId, data, cb) {
        validateId(subscriptionId, 'subscriptionId');
        return put('/subscriptions/' + subscriptionId, data, cb);
      },
      remove: function (subscriptionId, data, cb) {
        validateId(subscriptionId, 'subscriptionId');
        if (!cb && typeof data === 'function') {
          cb = data;
          data = {};
        }
        return del('/subscriptions/' + subscriptionId, data, cb);
      }
    },
    // transactions
    transactions: {
      create: function (transaction, cb) {
        return post('/transactions', transaction, cb);
      },
      list: function (data, cb) {
        return get('/transactions', data, cb);
      },
      details: function (transactionId, cb) {
        validateId(transactionId, 'transactionId');
        return get('/transactions/' + transactionId, {}, cb);
      },
      update: function (transactionId, data, cb) {
        return put('/transactions/' + transactionId, data, cb);
      }
    },
    // webhooks
    webhooks: {
      create: function (webhook, cb) {
        return post('/webhooks', webhook, cb);
      },
      list: function (data, cb) {
        return get('/webhooks', data, cb);
      },
      details: function (webhookId, cb) {
        validateId(webhookId, 'webhookId');
        return get('/webhooks/' + webhookId, {}, cb);
      },
      update: function (webhookId, data, cb) {
        validateId(webhookId, 'webhookId');
        return put('/webhooks/' + webhookId, data, cb);
      },
      remove: function (webhookId, cb) {
        validateId(webhookId, 'webhookId');
        return del('/webhooks/' + webhookId, {}, cb);
      }
    }
  };

  return endpoints;
}

// Create a new instance (eg. another apiVersion)
Paymill.prototype.Paymill = function (apiKey, apiVersion) {
  return new Paymill(apiKey, apiVersion);
};

module.exports = Paymill;

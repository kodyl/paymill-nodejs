/* Copyright 2014 Daniel Juhl, see LICENSE */
'use strict';

var https = require('https');
var querystring = require('querystring');

var responseHandler = require('./response');

// Constructor
function Paymill (apiKey, apiVersion) {
  apiVersion = apiVersion || 'v2.1';

  var authToken = 'Basic ' + new Buffer(apiKey + ':').toString('base64');

  // Request handler
  function request (method, endpoint, data, callback) {
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
    if (typeof callback === 'function'){
      responseHandler(req, callback);
    }
    if (payload) {
      req.write(payload);
    }
    req.end();
  }

  // Request method shorthands
  function get(path, data, callback) {
    request('GET', path, data, callback);
  }

  function post(path, data, callback) {
    request('POST', path, data, callback);
  }

  function put(path, data, callback) {
    request('PUT', path, data, callback);
  }

  function del(path, data, callback) {
    request('DELETE', path, data, callback);
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
        post('/clients', client, cb);
      },
      list: function (data, cb) {
        get('/clients', data, cb);
      },
      details: function (clientId, cb) {
        validateId(clientId, 'clientId');
        get('/clients/' + clientId, {}, cb);
      },
      update: function (clientId, data, cb) {
        validateId(clientId, 'clientId');
        put('/clients/' + clientId, data, cb);
      },
      remove: function (clientId, cb) {
        validateId(clientId, 'clientId');
        del('/clients/' + clientId, {}, cb);
      }
    },
    // offers
    offers: {
      create: function (offer, cb) {
        post('/offers', offer, cb);
      },
      list: function (data, cb) {
        get('/offers', data, cb);
      },
      details: function (offerId, cb) {
        validateId(offerId, 'offerId');
        get('/offers/' + offerId, {}, cb);
      },
      update: function (offerId, data, cb) {
        validateId(offerId, 'offerId');
        put('/offers/' + offerId, data, cb);
      },
      remove: function (offerId, cb) {
        validateId(offerId, 'offerId');
        del('/offers/' + offerId, {}, cb);
      }
    },
    // payments
    payments: {
      create: function (payment, cb) {
        post('/payments', payment, cb);
      },
      list: function (data, cb) {
        get('/payments', data, cb);
      },
      details: function (paymentId, cb) {
        validateId(paymentId, 'paymentId');
        get('/payments/' + paymentId, {}, cb);
      },
      remove: function (paymentId, cb) {
        validateId(paymentId, 'paymentId');
        del('/payments/' + paymentId, {}, cb);
      }
    },
    // preauthorizations
    preauthorizations: {
      create: function (preauthorization, cb) {
        post('/preauthorizations', preauthorization, cb);
      },
      list: function (data, cb) {
        get('/preauthorizations', data, cb);
      },
      details: function (preauthorizationId, cb) {
        validateId(preauthorizationId, 'preauthorizationId');
        get('/preauthorizations/' + preauthorizationId, {}, cb);
      },
      remove: function (preauthorizationId, cb) {
        validateId(preauthorizationId, 'preauthorizationId');
        del('/preauthorizations/' + preauthorizationId, {}, cb);
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
        post('/refunds/' + transactionId, data, cb);
      },
      list: function (data, cb) {
        get('/refunds', data, cb);
      },
      details: function (refundId, cb) {
        validateId(refundId, 'refundId');
        get('/refunds/' + refundId, {}, cb);
      }
    },
    // subscriptions
    subscriptions: {
      create: function (subscription, cb) {
        post('/subscriptions', subscription, cb);
      },
      list: function (data, cb) {
        get('/subscriptions', data, cb);
      },
      details: function (subscriptionId, cb) {
        validateId(subscriptionId, 'subscriptionId');
        get('/subscriptions/' + subscriptionId, {}, cb);
      },
      update: function (subscriptionId, data, cb) {
        validateId(subscriptionId, 'subscriptionId');
        put('/subscriptions/' + subscriptionId, data, cb);
      },
      remove: function (subscriptionId, data, cb) {
        validateId(subscriptionId, 'subscriptionId');
        if (!cb && typeof data === 'function') {
          cb = data;
          data = {};
        }
        del('/subscriptions/' + subscriptionId, data, cb);
      }
    },
    // transactions
    transactions: {
      create: function (transaction, cb) {
        post('/transactions', transaction, cb);
      },
      list: function (data, cb) {
        get('/transactions', data, cb);
      },
      details: function (transactionId, cb) {
        validateId(transactionId, 'transactionId');
        get('/transactions/' + transactionId, {}, cb);
      },
      update: function (transactionId, data, cb) {
        put('/transactions/' + transactionId, data, cb);
      }
    },
    // webhooks
    webhooks: {
      create: function (webhook, cb) {
        post('/webhooks', webhook, cb);
      },
      list: function (data, cb) {
        get('/webhooks', data, cb);
      },
      details: function (webhookId, cb) {
        validateId(webhookId, 'webhookId');
        get('/webhooks/' + webhookId, {}, cb);
      },
      update: function (webhookId, data, cb) {
        validateId(webhookId, 'webhookId');
        put('/webhooks/' + webhookId, data, cb);
      },
      remove: function (webhookId, cb) {
        validateId(webhookId, 'webhookId');
        del('/webhooks/' + webhookId, {}, cb);
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

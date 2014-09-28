paymill-nodejs
==============

Node.js wrapper for [Paymill](http://paymill.com/) [API/V2.x](https://developers.paymill.com/en/reference/api-reference/).

This module as been created as a drop in replacement for [komola's paymill-node](https://github.com/komola/paymill-node) which does not support the latest features in the Paymill API/V2.1


Installation
------------

`npm install paymill`


Usage
-----

The first thing to do, is create a paymill instance using your `Paymill private key` and an optional `apiVersion` (which can be either `v2` or `v2.1`, with the last one being the default, if the argument is omitted).

```javascript
var paymill = require('paymill')('apiKey'[, 'apiVersion']);
```

We can now access the API using a generic pattern, and all methods takes a callback as the last argument.

```javascript
paymill.{resourceName}.{method}(..., function (err, ...) {
	// ...
});
```


API endpoints
-------------

*Plain JavaScript object, e.g. `{ key: 'value' }` is expected as `data` and as the argument in all `create`-method*

 * [clients](https://developers.paymill.com/en/reference/api-reference/#document-clients)
  * [`create(client)`](https://developers.paymill.com/en/reference/api-reference/#create-new-client)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-clients)
  * [`details(clientId)`](https://developers.paymill.com/en/reference/api-reference/#client-details)
  * [`update(clientId, data)`](https://developers.paymill.com/en/reference/api-reference/#update-client)
  * [`remove(clientId)`](https://developers.paymill.com/en/reference/api-reference/#remove-client)
 * [offers](https://developers.paymill.com/en/reference/api-reference/#document-offers)
  * [`create(offer)`](https://developers.paymill.com/en/reference/api-reference/#create-new-offer)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-offers)
  * [`details(offerId)`](https://developers.paymill.com/en/reference/api-reference/#offer-details)
  * [`update(offerId, data)`](https://developers.paymill.com/en/reference/api-reference/#update-offer)
  * [`remove(offerId)`](https://developers.paymill.com/en/reference/api-reference/#remove-offer)
 * [payments](https://developers.paymill.com/en/reference/api-reference/#document-payments)
  * [`create(payment)`](https://developers.paymill.com/en/reference/api-reference/#create-new-payment)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-payments)
  * [`details(paymentsId)`](https://developers.paymill.com/en/reference/api-reference/#payment-details)
  * [`remove(paymentsId)`](https://developers.paymill.com/en/reference/api-reference/#remove-payment)
 * [preauthorizations](https://developers.paymill.com/en/reference/api-reference/#document-preauthorizations)
  * [`create(preauthorization)`](https://developers.paymill.com/en/reference/api-reference/#create-new-preauthorization-with)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-preauthorizations)
  * [`details(preauthorizationId)`](https://developers.paymill.com/en/reference/api-reference/#preauthorization-details)
  * [`remove(preauthorizationId)`](https://developers.paymill.com/en/reference/api-reference/#remove-preauthorization)
 * [refunds](https://developers.paymill.com/en/reference/api-reference/#document-refunds)
  * [`create(transactionId, amount[, description])`](https://developers.paymill.com/en/reference/api-reference/#refund-transaction)  
  (for consistency, `amount` can also be an object with `amount` and `description`)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-refunds)
  * [`details(refundId)`](https://developers.paymill.com/en/reference/api-reference/#refund-details)
 * [subscriptions](https://developers.paymill.com/en/reference/api-reference/#document-subscriptions)
  * [`create(subscription)`](https://developers.paymill.com/en/reference/api-reference/#create-new-subscription)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-subscriptions)
  * [`details(subscriptionId)`](https://developers.paymill.com/en/reference/api-reference/#subscription-details)
  * [`update(subscriptionId, data)`](https://developers.paymill.com/en/reference/api-reference/#update-subscription)
  * [`remove(subscriptionId, data)`](https://developers.paymill.com/en/reference/api-reference/#cancel-or-delete-subscription)
 * [transactions](https://developers.paymill.com/en/reference/api-reference/#document-transactions)
  * [`create(transaction)`](https://developers.paymill.com/en/reference/api-reference/#create-new-transaction-with)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-transactions)
  * [`details(transactionId)`](https://developers.paymill.com/en/reference/api-reference/#transaction-details)
  * [`update(transactionId, data)`](https://developers.paymill.com/en/reference/api-reference/#update-transaction)
 * [webhooks](https://developers.paymill.com/en/reference/api-reference/#document-webhooks)
  * [`create(webhook)`](https://developers.paymill.com/en/reference/api-reference/#create-new-url-webhook)
  * [`list(data)`](https://developers.paymill.com/en/reference/api-reference/#list-webhooks)
  * [`details(webhookId)`](https://developers.paymill.com/en/reference/api-reference/#webhook-details)
  * [`update(webhookId, data)`](https://developers.paymill.com/en/reference/api-reference/#update-webhook)
  * [`remove(webhookId)`](https://developers.paymill.com/en/reference/api-reference/#remove-webhook)


TODO
----
* Add unit and integration tests
* Add examples to show how to use the wrapper in various cases


Author
------
Written by [Daniel Juhl](http://danieljuhl.dk). Inspiration from [Ask Bjørn Hansen](https://github.com/abh) and [komola's paymill-node](https://github.com/komola/paymill-node).

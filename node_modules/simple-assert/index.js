/*!
 * simple-assert
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var AssertionError = require('assertion-error');

/*!
 * Primary export
 */

var exports = module.exports = assert;

/*!
 * Expose AssertionError constructor
 */

exports.AssertionError = AssertionError;

/**
 * ### assert (expr[, msg])
 *
 * Perform a truthy assertion.
 *
 * ```js
 * var assert = require('simple-assert');
 * assert(true, 'true is truthy');
 * assert(1, '1 is truthy');
 * assert('string', 'string is truthy');
 * ```
 *
 * @param {Mixed} expression to test for truthiness
 * @param {String} message on failure
 * @throws AssertionError
 */

function assert (expr, msg, ssf) {
  if (!expr) {
    throw new AssertionError(msg || 'Assertion Failed', null, ssf || arguments.callee);
  }
}

/**
 * ### assert.not (expr[, msg])
 *
 * Perform a falsey assertion.
 *
 * ```js
 * db.get(123, function (err, doc) {
 *   assert.not(err, 'db.get returned error');
 *   // ...
 * });
 * ```
 *
 * @param {Mixed} express to test for falsiness
 * @param {String} messag eon failure
 * @throws AssertionError
 */

exports.not = function (expr, msg) {
  assert(!expr, msg, arguments.callee);
};

/**
 * ### assert.fail ([msg])
 *
 * Force an `AssertionError` to be thrown.
 *
 * ```js
 * switch (res.statusCode) {
 *   case 200:
 *     // ..
 *     break;
 *   case 404:
 *     // ..
 *     break;
 *   default:
 *     assert.fail('Unknown response statusCode');
 * }
 * ```
 *
 * @param {String} failure message
 * @throws AssertionError
 */

exports.fail = function (msg) {
  assert(false, msg, arguments.callee);
};

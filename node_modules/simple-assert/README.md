# simple-assert [![Build Status](https://travis-ci.org/chaijs/simple-assert.png?branch=master)](https://travis-ci.org/chaijs/simple-assert)

> Vanilla Assertions

A simple `assert` wrapper around [chaijs/assertion-error](https://github.com/chaijs/assertion-error). This probably
won't be useful to the average user unless you are a minimalist; you probably want [Chai](https://github.com/chaijs/chai).
We use it to avoid circular dependencies when testing Chai's dependencies.

## Installation

### Node.js

`simple-assert` is available on [npm](http://npmjs.org).

    $ npm install simple-assert

### Component

`simple-assert` is available as a [component](https://github.com/component/component).

    $ component install chaijs/simple-assert

## Usage

### assert (expr[, msg])

* **@param** _{Mixed}_ expression to test for truthiness
* **@param** _{String}_ message on failure

Perform a truthy assertion.

```js
var assert = require('simple-assert');
assert(true, 'true is truthy');
assert(1, '1 is truthy');
assert('string', 'string is truthy');
```


### assert.not (expr[, msg])

* **@param** _{Mixed}_ express to test for falsiness
* **@param** _{String}_ messag eon failure

Perform a falsey assertion.

```js
db.get(123, function (err, doc) {
  assert.not(err, 'db.get returned error');
  // ...
});
```


### assert.fail ([msg])

* **@param** _{String}_ failure message

Force an `AssertionError` to be thrown.

```js
switch (res.statusCode) {
  case 200:
    // ..
    break;
  case 404:
    // ..
    break;
  default:
    assert.fail('Unknown response statusCode');
}
```

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com> (http://alogicalparadox.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

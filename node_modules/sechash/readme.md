# sechash

#### Secure password hashing with salt and key stretching

Author: James Brumond

Version: 0.2.0


Copyright 2012 James Brumond

Dual licensed under MIT and GPL

## Install

```bash
$ npm install sechash
```

## Usage

### Running a simple hash

```javascript
var sechash = require('sechash');

// This will do a simple sha1 hash, the same as if you used the
// built-in "crypto" module.
var hash = sechash.basicHash('sha1', 'Your String');

// You can also use the testBasicHash method to easily test if
// a string matches a hash
sechash.testBasicHash('sha1', 'Your String', hash); // true
```

### Using the strong stuff

```javascript
var sechash = require('sechash');

var opts = {
	algorithm: 'sha1',
	iterations: 2000,
	salt: 'some salt string'
};

// This will hash the string quite a bit more strongly.
var hash = sechash.strongHashSync('Your String', opts);

// Because this function can take so long to run, it has an asynchronous
// option as well, which is very similar...
sechash.strongHash('Your String', opts, function(err, hash) {
    // ...
});

// As of version 0.2.0, basic promise-style callbacks (using oath) are also
// supported on async functions (strongHash and testHash).
sechash.strongHash('Your String', opts).then(function(hash) {
	// ...
});
```

### Testing a hash

```javascript
var sechash = require('sechash');

var opts = {
	algorithm: 'sha1',
	iterations: 2000,
	salt: 'some salt string'
};

// First we generate a hash...
var hash = sechash.strongHashSync('Your String', opts);

// To test if a string matches a hash, we you the testHash method
sechash.testHashSync('Your String', hash, opts);    // true
sechash.testHashSync('Another String', hash, opts); // false

// Again, this function also has an async form...
sechash.testHash('Your String', hash, opts, function(err, isMatch) {
    console.log(isMatch); // true
});
```

### More Advanced Configuration

The following options can be given in the options object seen above. Also, the options object can also be excluded and all default options will be used.

###### algorithm

The hashing algorithm to use. Common hashing algorithms include `"sha1"`, `"md5"`, `"sha256"`, and `"sha512"`. The default used by sechash is `"sha1"`.

###### iterations

One method used by sechash to make hashes more secure is [key stretching][1], or iterating over a hash multiple times with the expressed purpose of slowing down the hashing process. This value is the number of times to hash the given string. The default used is `2000`.

###### salt

Another method used by sechash is called [salt][2]. By default, sechash will randomly generate some salt to use, but you can provide this value to specify the salt string.

###### intervalLength

This value only applies to the asynchronous functions. Key stretching greatly increases the amount of time to run a hash, which means that (especially for large `iterations` values) your application will be blocked for a short while. To avoid blocking for too long, these functions will yield control back to the event loop every so often to allow other parts of the application to run. This value refers to how many iterations should run between "yields". This value defaults to 500.

###### includeMeta

When you generate a hash using sechash, the actual hash will often be prefixed with some meta data about how the hash was generated.

```javascript
sechash.strongHashSync('foo', {salt: 'baz', iterations: 3000});

// baz:sha1:3000:5c638e9d80355c8080330a6687ebb60ea7821a9f
```

This allows sechash to correctly repeat the hashing process, therefore making hash testing possible. If you do not want this meta data included in the hash, you can set `includeMeta` to false. One reason for doing this may be that, instead of using a random salt, you may want to use one secret salt value and you don't want this value stored with the hash.


   [1]: http://en.wikipedia.org/wiki/Key_stretching
   [2]: http://en.wikipedia.org/wiki/Salt_(cryptography)


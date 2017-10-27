/**
 * sechash
 *
 * Secure password hashing using salt and keystretching
 *
 * @author     James Brumond
 * @version    0.2.0
 * @copyright  Copyright 2012 James Brumond
 * @license    Dual licensed under MIT and GPL
 */
	
var oath    = require('oath');
var crypto  = require('crypto');

var defaultOptions = {
	algorithm: 'sha1',
	iterations: 2000,
	includeMeta: true,
	intervalLength: 500,
	salt: function() {
		return hash(this.algorithm, String(Math.random())).substring(0, 6);
	}
};

// ----------------------------------------------------------------------------
//  Public functions

exports.basicHash = function(alg, str) {
	return hash(alg, str);
};

exports.testBasicHash = function(alg, str, testHash) {
	return (hash(alg, str) === testHash);
};

exports.strongHashSync = function(str, opts) {
	opts = getOptions(opts);
	for (var i = 0; i < opts.iterations; i++) {
		str = hash(opts.algorithm, str + opts.salt);
	}
	return opts.meta + str;
};

exports.strongHash = function(str, opts, callback) {
	var promise = new oath();
	if (typeof opts === 'function') {
		callback = opts;
		opts = null;
	}
	opts = getOptions(opts);
	asyncFor(opts.iterations, opts.intervalLength,
		function() {
			str = hash(opts.algorithm, str + opts.salt);
		},
		function() {
			done(promise, callback, opts.meta + str);
		}
	);
	return promise.promise;
};

exports.testHashSync = function(str, hash, opts) {
	opts = getOptions(opts, hash);
	return (exports.strongHashSync(str, opts) === hash);
};

exports.testHash = function(str, hash, opts, callback) {
	var promise = new oath();
	if (typeof opts === 'function') {
		callback = opts;
		opts = null;
	}
	opts = getOptions(opts, hash);
	exports.strongHash(str, opts, function(err, result) {
		done(promise, callback, hash === result);
	});
	return promise.promise;
};



// ------------------------------------------------------------------
//  Helpers

function hash(alg, str) {
	var hashsum = crypto.createHash(alg);
	hashsum.update(str);
	return hashsum.digest('hex');
}

function done(promise, callback, result) {
	if (typeof callback === 'function') {
		callback(null, result);
	}
	promise.resolve(result);
}

function getOptions(opts, hash) {
	var result = { };
	Object.keys(defaultOptions).forEach(function(key) {
		result[key] = defaultOptions[key];
	});
	Object.keys(opts || { }).forEach(function(key) {
		result[key] = opts[key];
	});
	if (typeof result.salt === 'function') {
		result.salt = result.salt();
	}
	if (result.includeMeta) {
		result.meta = result.salt + ':' + result.algorithm + ':' + result.iterations + ':'
	} else {
		result.meta = '';
	}
	if (hash && hash.indexOf(':') >= 0) {
		hash = hash.split(':');
		result.salt = hash[0];
		result.algorithm = hash[1];
		result.iterations = Number(hash[2]);
	}
	return result;
}

function asyncFor(count, intervalLength, func, callback) {
	function runLoop() {
		for (var i = 0; (i < intervalLength && count); i++, count--) {
			func(count, i);
		}
		if (count) {
			process.nextTick(runLoop);
		} else {
			callback();
		}
	}
	runLoop();
}

/* End of file sechash.js */

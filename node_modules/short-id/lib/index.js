
/**
 * Self-contained short-life ID generating module
 *
 * Not guarenteed to be unique outside of a single instance of the module.
 */

var sechash = require('sechash');
var merge   = require('merge-recursive');

var current = 0;
var storage = { };
var config = {
	length: 6,
	algorithm: 'sha1',
	salt: Math.random,
	useObjects: false
};

exports.configure = function(conf) {
	Object.keys(conf).forEach(function(key) {
		config[key] = conf[key];
	});
};

exports.generate = function(conf) {
	conf = merge({ }, config, conf || { });
	
	var key;
	var salt = config.salt;
	
	if (typeof salt === 'function') {
		salt = salt();
	}
	
	do {
		key = sechash.basicHash(config.algorithm, String(current++) + salt).slice(0, config.length);
	} while (storage.hasOwnProperty(key));
	
	storage[key] = null;
	
	if (conf.useObjects) {
		key = new exports.Id(key);
	}
	
	return key;
};

exports.invalidate = function(key) {
	delete storage[keyValue(key)];
};

exports.store = function(value) {
	var key = exports.generate();
	storage[keyValue(key)] = value;
	return key;
};

exports.fetch = function(key) {
	return storage[keyValue(key)];
};

exports.fetchAndInvalidate = function(key) {
	var value = exports.fetch(key);
	exports.invalidate(key);
	return value;
};

// ------------------------------------------------------------------

var type = function(value) {
	return Object.prototype.toString.call(value).slice(8, -1);
};

exports.isId = function(value) {
	return (type(value) === 'Object' && (value instanceof exports.Id || value._isShortIdObject));
};

// ------------------------------------------------------------------

exports.Id = function(id) {
	if (! this instanceof exports.Id) {
		return new exports.Id(id);
	}
	
	if (! id) {
		id = exports.generate({ useObjects: false });
	}
	
	Object.defineProperty(this, 'id', {
		value: id,
		writable: false,
		enumerable: true
	});
};

Object.defineProperty(exports.Id.prototype, '_isShortIdObject', {
	value: true,
	writable: false,
	enumerable: false
});

exports.Id.prototype.toString = function() {
	return this.id;
};

// ------------------------------------------------------------------

function keyValue(key) {
	return exports.isId(key) ? String(key) : key
}


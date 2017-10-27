
var sechash = require('../lib/sechash');

var str1 = 'foo';
var str2 = 'bar';
var conf = {
	salt: 'baz',
	algorithm: 'sha1',
	includeMeta: false
};

// Basic Hash
var basicHash = sechash.basicHash(conf.algorithm, str1);
console.log('\nBasic Hash: "' + basicHash + '"');
console.log('Test Basic Hash (pass): ' +
	String(sechash.testBasicHash(conf.algorithm, str1, basicHash))
);
console.log('Test Basic Hash (fail): ' +
	String(sechash.testBasicHash(conf.algorithm, str2, basicHash))
);

// Strong Hash (Sync w/o meta)
testStrongHashSync(false);

// Strong Hash (Async w/o meta)
testStrongHashAsync(false, function() {
	
	conf.includeMeta = true;
	
	// Strong Hash (Sync w/ meta)
	testStrongHashSync(true);
	
	// Strong Hash (Async w/ meta)
	testStrongHashAsync(true, function() {
		
		console.log('');
		
	});
	
});

// ------------------------------------------------------------------
//  Helpers

function testStrongHashSync(meta) {
	meta = 'w/' + (meta ? '' : 'o');
	var strongHash = sechash.strongHashSync(str1, conf);
	console.log('\nStrong Hash ' + meta + ' Meta (Sync): "' + strongHash + '"');
	console.log('Test Hash (pass): ' +
		String(sechash.testHashSync(str1, strongHash, conf))
	);
	console.log('Test Hash (fail): ' +
		String(sechash.testHashSync(str2, strongHash, conf))
	);
}

function testStrongHashAsync(meta, callback) {
	meta = 'w/' + (meta ? '' : 'o');
	sechash.strongHash(str1, conf).then(function(strongHash) {
		console.log('\nStrong Hash ' + meta + ' Meta (Async): "' + strongHash + '"');
		sechash.testHash(str1, strongHash, conf).then(function(isMatch) {
			console.log('Test Hash (pass): ' + String(isMatch));
			sechash.testHash(str2, strongHash, conf).then(function(isMatch) {
				console.log('Test Hash (fail): ' + String(isMatch));
				callback();
			});
		});
	});
}


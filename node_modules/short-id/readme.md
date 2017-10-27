# short-id

Self-contained short-life ID generating module

_Not guarenteed to be unique outside of a single instance of the module._

## Install

```bash
$ npm install short-id
```

## Usage

```javascript
var ids = require('short-id');

ids.generate();  // "aeaf15"
ids.generate();  // "1d0449"

ids.store('foo');  // "8dbd46"
ids.fetch('8dbd46');  // 'foo'

ids.invalidate('8dbd46');
ids.fetch('8dbd46');  // undefined
```

### ids.generate ( void )

Generates a new ID string and returns it.

### ids.invalidate ( String key )

Invalidates the given id key, removing any data stored with it and recycling it.

### ids.store ( mixed value )

Generates a new key and stores a value under that key.

### ids.fetch ( String key )

Looks up a value stored under the given key.

### ids.fetchAndInvalidate ( String key )

The equivilent of calling `fetch` and then `invalidate`. Returns the stored value.

### ids.configure ( Object conf )

Changes configuration values.

```javascript
// Call to configure shown with the default values
ids.configure({
	length: 6,          // The length of the id strings to generate
	algorithm: 'sha1',  // The hashing algoritm to use in generating keys
	salt: Math.random   // A salt value or function
});
```


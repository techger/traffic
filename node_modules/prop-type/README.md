# prop-type

Small wrapper to wrap your custom type check so that you can use `myCustomType.isRequired` in a similar fasion to React's built-in types.
React expects type-checks to return an `Error` object upon faillure and nothing otherwise.

### Install

    npm install prop-type

### Usage:
     
    var check = function(props, propName){
        if(props[propName]) return;
        return Error("Test error");
    };
    
    var type = propType(check);
    
    
    assert.ok(!type({}, "foo"), "undefined is ok, as the type is optional by default");
    assert.ok( type.isRequired({}, "foo") instanceof Error, "But null is not ok for required");
    assert.equal( type.isRequired({ foo: true }, "foo"), undefined, "Return undefined when the typecheck is ok");

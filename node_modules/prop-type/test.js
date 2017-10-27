"use strict";

var test = require("tape");
var propType = require("./index");

test("must wrap and add isRequired", function(assert){
    var check = function(props, propName){
        if(props[propName]) return;
        return Error("Test error");
    };
    
    var type = propType(check);
    
    
    assert.ok(!type({}, "foo"), "undefined is ok, as the type is optional by default");
    assert.ok( type.isRequired({}, "foo") instanceof Error, "But null is not ok for required");
    assert.equal( type.isRequired({ foo: true }, "foo"), undefined, "Return undefined when the typecheck is ok");

    assert.end();
});
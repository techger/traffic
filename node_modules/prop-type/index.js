"use strict";

/**
 * Small wrapper to wrap your custom type check so that you can use `myCustomType.isRequired` in a similar fasion to React's built-in types.
 * 
 * Usage:
 *      
 *      var type = propType(function isFoo(props, name){  
 *          if(props[name] !== "foo")
 *              return new TypeError("not a foo");
 *      });
 * 
 *      // optional by default:
 *      assert.ok( ! type(null) );
 * 
 *      // required like so:
 *      assert.ok( type.isRequired(null) );
 * 
 */
function propType(typeCheck) {
    var type = function(props, propName) {
        if (props[propName]) return typeCheck.apply(null, arguments);
    };

    Object.defineProperty(type, "isRequired", {
        get: function() {
            return typeCheck;
        }
    });

    return type;
}

module.exports = propType;
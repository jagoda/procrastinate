var Mixable = require('./Mixable');


function Enumerable (wrappedObject) {
  var object = this,
      prototype;
      
  if (typeof wrappedObject !== 'undefined') {
    prototype = new Mixable();
    prototype.mixin(Enumerable);
    
    object = Object.create(prototype).mixin(wrappedObject);
  }
      
  return object;
}

Enumerable.prototype.forEach = function (callback) {
  var keys = Object.keys(this),
      i, key, value;
  
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    value = this[key];
    
    callback.call(this, key, value);
  }
  
  return this;
};


module.exports = Enumerable;

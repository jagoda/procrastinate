var inject = require('./Mixable').inject;


function Enumerable () {
}

Enumerable.prototype.forEach = function (callback) {
  var key;
  
  if (typeof callback === 'function') {
    for (key in this) {
      callback.call(this, key, this[key]);
    }
  }
  
  return this;
};


Enumerable.wrap = function (object) {
  var wrapper = Object.create(object);
  
  inject(wrapper).with(Enumerable);
  
  return wrapper;
};


module.exports = Enumerable;

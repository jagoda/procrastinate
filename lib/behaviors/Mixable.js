var Enumerable = require('./Enumerable');


function Mixable () {
}

Mixable.prototype.mixin = function (source) {
  var isConstructor = typeof source === 'function',
      properties = isConstructor ? new Enumerable(source.prototype) :
        new Enumerable(source),
      self = this,
      parameters;
      
  properties.forEach(function (key, value) {
    self[key] = value;
  });
  
  if (isConstructor) {
    parameters = Array.prototype.slice.call(arguments, 1);
    
    source.apply(this, parameters);
  }
  
  return this;
};


Mixable.inject = function (target) {
  return new Injector(target);
};


function Injector (target) {
  this._target = target;
}

Injector.prototype.with = function (source) {
  return Mixable.prototype.mixin.apply(this._target, arguments);
};


module.exports = Mixable;

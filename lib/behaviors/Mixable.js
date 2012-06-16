var forEach = require('./Enumerable').forEach;


function Mixable () {
}

Mixable.prototype.mixin = function (source) {
  var isConstructor = typeof source === 'function',
      mixable = this,
      target = isConstructor ? source.prototype : source,
      parameters;
  
  forEach('property').on(target).do(function (name, descriptor) {
    if (descriptor.enumerable) {
      Object.defineProperty(mixable, name, descriptor);
    }
  });
  
  if (isConstructor) {
    parameters = Array.prototype.slice.call(arguments, 1);
    
    source.apply(mixable, parameters);
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

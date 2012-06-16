var forEach = require('./Enumerable').forEach;


function Bindable () {
}

Bindable.prototype.bind = function () {
  var context = this,
      offset = 0,
      method, parameters;
  
  if (typeof arguments[offset] !== 'function' &&
      (typeof arguments[offset] !== 'string' || ! (arguments[offset] instanceof String)) &&
      arguments[offset] instanceof Object)
  {
    context = arguments[offset];
    offset++;
  }
  
  parameters = Array.prototype.slice.call(arguments, offset + 1);
  
  if (typeof arguments[offset] === 'function') {
    method = arguments[offset];
  }
  else if (typeof arguments[offset] === 'string' || arguments[offset] instanceof String) {
    method = this[arguments[offset]];
  }
  
  return Bindable.bind.apply(this, [ context, method ].concat(parameters));
};


Bindable.bind = function (context, fn) {
  var parameters = Array.prototype.slice.call(arguments, 2);
  
  if (arguments.length == 1) {
    return new Binder(arguments[0]);
  }
  
  return function () {
    return fn.apply(context,
      parameters.concat(Array.prototype.slice.call(arguments))
    );
  };
};


function Binder (fn, context, parameters) {
  this._context = context || (function () { return this; })();
  this._fn = fn;
  this._parameters = parameters || [];
}

Binder.prototype.to = function (context) {
  var fn = this._fn,
      parameters = this._parameters,
      boundFunction = Binder._bind(context, fn, parameters);
      
  Binder.call(boundFunction, fn, context, parameters);
  forEach('mapping').on(Binder.prototype).do(function (key, value) {
    boundFunction[key] = value;
  });
      
  return boundFunction;
};

Binder.prototype.withArguments = function () {
  var context = this._context,
      fn = this._fn,
      parameters = this._parameters.concat(Array.prototype.slice.call(arguments)),
      
      boundFunction = Binder._bind(context, fn, parameters);
      
  Binder.call(boundFunction, fn, context, parameters);
  forEach('mapping').on(Binder.prototype).do(function (key, value) {
    boundFunction[key] = value;
  });
  
  return boundFunction;
};

Binder._bind = function (context, fn, parameters) {
  parameters = [ context, fn ].concat(parameters);
      
  return Bindable.bind.apply(this, parameters);
};


module.exports = Bindable;

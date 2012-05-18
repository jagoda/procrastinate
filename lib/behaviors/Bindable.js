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
  
  return function () {
    return fn.apply(context,
      parameters.concat(Array.prototype.slice.call(arguments))
    );
  };
};


module.exports = Bindable;

var global = (function () { return this; })(),
    utilities = module.exports;


utilities.attach = function (fn, context, parameters) {
  parameters = parameters || [];
  
  return function () {
    return fn.apply(context,
      parameters.concat(Array.prototype.slice.call(arguments))
    );
  };
};

utilities.bind = function (fn, context) {
  var parameters = Array.prototype.slice.call(arguments, 2);
  
  return utilities.attach(fn, context, parameters);
};

function Mixable () {
}

Mixable.prototype.mixin = function (source) {
  var isConstructor = typeof source === 'function',
      properties = source,
      key;
  
  if (isConstructor) {
    properties = source.prototype;
  }
  
  for (key in properties) {
    if (isConstructor || key[0] !== '_') {
      this[key] = properties[key];
    }
  }
  
  if (isConstructor) {
    source.call(this);
  }
  
  return this;
};


module.exports = Mixable;

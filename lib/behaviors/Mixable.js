function Mixable () {
}

Mixable.prototype.mixin = function (object) {
  var isConstructor = typeof object === 'function',
      properties = object,
      key;
  
  if (isConstructor) {
    properties = object.prototype;
  }
  
  for (key in properties) {
    if (isConstructor || key[0] != '_') {
      this[key] = properties[key];
    }
  }
  
  if (isConstructor) {
    object.call(this);
  }
  
  return this;
};


module.exports = Mixable;

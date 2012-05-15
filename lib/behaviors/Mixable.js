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


function Injector (object) {
  this._object = object;
}

Injector.prototype.with = function () {
  var apis = arguments,
      i;
      
  for (i = 0; i < apis.length; i++) {
    Mixable.prototype.mixin.call(this._object, apis[i]);
  }
  
  return this._object;
};


Mixable.inject = function (object) {
  return new Injector(object);
};


module.exports = Mixable;

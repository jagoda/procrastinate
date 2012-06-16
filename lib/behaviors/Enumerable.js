function Enumerable (object) {
  this._value = arguments.length > 0 ? object : this;
}

Enumerable.prototype.key = function (callback) {
  var object = this._value,
      i, key,
      
      keyList = Object.keys(object);
      
  for (i = 0; i < keyList.length; i++) {
    key = keyList[i];
    
    if (key[0] !== '_') {
      callback.call(object, key);
    }
  }
  
  return this;
};

Enumerable.prototype.mapping = function (callback) {
  var enumerable = this,
      object = this._value;
      
  enumerable.key(function (key) {
    callback.call(object, key, object[key]);
  });
  
  return this;
};

Enumerable.prototype.property = function (callback) {
  var object = this._value,
      properties = Object.getOwnPropertyNames(object),
      i, name;
      
  for (i = 0; i < properties.length; i++) {
    name = properties[i];
    callback.call(object, name, Object.getOwnPropertyDescriptor(object, name));
  }
  
  return this;
};

Enumerable.prototype.value = function (callback) {
  var enumerable = this,
      object = this._value;
  
  enumerable.key(function (key) {
    callback.call(object, object[key]);
  });
  
  return this;
};


Enumerable.forEach = function (method) {
  return new Enumerator(method);
};


function Enumerator (method) {
  this._method = method;
  this._target = undefined;
}

Enumerator.prototype.on = function (object) {
  this._target = new Enumerable(object);
  
  return this;
};

Enumerator.prototype.do = function (callback) {
  var method = this._method,
      target = this._target;
      
  return target[method](callback);
};


module.exports = Enumerable;

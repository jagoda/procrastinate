function Enumerable (object) {
  this._value = arguments.length > 0 ? object : this;
}

Enumerable.prototype.forEach = function (callback) {
  var object = this._value,
      key;
      
  if (typeof callback === 'function') {
    for (key in object) {
      callback.call(object, key, object[key]);
    }
  }
  
  return this;
};


Enumerable.forEachKeyIn = function (object) {
  var enumerable = forceEnumerable(object);
  
  enumerable.do = function (callback) {
    this.forEach(function (key, value) {
      callback(key);
    });
  };
  
  return enumerable;
};

Enumerable.forEachValueIn = function (object) {
  var enumerable = forceEnumerable(object);
  
  enumerable.do = function (callback) {
    this.forEach(function (key, value) {
      callback(value);
    });
  };
  
  return enumerable;
};

Enumerable.forEachPairIn = function (object) {
  var enumerable = forceEnumerable(object);
  
  enumerable.do = Enumerable.prototype.forEach;
  
  return enumerable;
};


function forceEnumerable (object) {
  var enumerable = object;
  
  if (! (enumerable instanceof Enumerable)) {
    enumerable = new Enumerable(enumerable);
  }
  
  return enumerable;
}


module.exports = Enumerable;

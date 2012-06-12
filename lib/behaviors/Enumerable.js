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
  return new KeyEnumerator(object);
};

Enumerable.forEachValueIn = function (object) {
  return new ValueEnumerator(object);
};

Enumerable.forEachPairIn = function (object) {
  return new PairEnumerator(object);
};


function PairEnumerator (object) {
  this._enumerable = (object instanceof Enumerable) ? object :
    new Enumerable(object);
}

PairEnumerator.prototype.do = function (callback) {
  var enumerable = this._enumerable;
  
  enumerable.forEach(callback);
  
  return this;
};

function KeyEnumerator (object) {
  PairEnumerator.call(this, object);
}

KeyEnumerator.prototype = new PairEnumerator();

KeyEnumerator.prototype.do = function (callback) {
  PairEnumerator.prototype.do.call(this, function (key, value) {
    callback.call(this, key);
  });
  
  return this;
};

function ValueEnumerator (object) {
  PairEnumerator.call(this, object);
}

ValueEnumerator.prototype = new PairEnumerator();

ValueEnumerator.prototype.do = function (callback) {
  PairEnumerator.prototype.do.call(this, function (key, value) {
    callback.call(this, value);
  });
  
  return this;
};


module.exports = Enumerable;

var Enumerable = require('./Enumerable');


function Comparable (value) {
  this._value = arguments.length > 0 ? value : this;
}

Comparable.prototype.defined = function () {
  return typeof this._value !== 'undefined';
};

Comparable.prototype.equalTo = function (expected) {
  return this._value == expected;
};

Comparable.prototype.falsy = function () {
  return ! this._value;
};

Comparable.prototype.not = function () {
  var inverse = Object.create(this),
      methods = new Enumerable(Comparable.prototype),
      self = this;
      
  methods.forEach(function (name, implementation) {
    if (name != 'not') {
      inverse[name] = function () {
        return ! implementation.apply(this, arguments);
      };
    }
  });
  
  inverse.not = function () {
    return self;
  };
  
  return inverse;
};

Comparable.prototype.truthy = function () {
  return !! this._value;
};

Comparable.prototype.undefined = function () {
  return typeof this._value === 'undefined';
};


Comparable.valueOf = function (value) {
  return new Comparator(value);
};


function Comparator (value) {
  this._value = value;
}

Comparator.prototype.is = function () {
  return new Comparable(this._value);
};


module.exports = Comparable;

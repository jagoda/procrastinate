var Enumerable = require('./Enumerable');


function Comparable (value) {
  this._value = arguments.length > 0 ? value : this;
}

Comparable.prototype.equalTo = function (expected) {
  return this._value == expected;
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


module.exports = Comparable;

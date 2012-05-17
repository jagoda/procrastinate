function Comparable (value) {
  this._value = arguments.length > 0 ? value : this;
}

Comparable.prototype.equalTo = function (expected) {
  return this._value == expected;
};


module.exports = Comparable;

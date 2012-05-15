function Comparable () {
}

Comparable.prototype.equalTo = function (expected) {
  return this == expected;
};

Comparable.prototype.not = function () {
  
};


module.exports = Comparable;

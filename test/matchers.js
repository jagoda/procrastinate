var matchers = module.exports;


matchers.toBeAnInstanceOf = function (expected) {
  return this.actual instanceof expected;
};

matchers.toBeOfType = function (expected) {
  return typeof this.actual === expected;
};

matchers.toBeSimilarTo = function (expected) {
  var key;
  
  for (key in expected) {
    if (this.actual[key] != expected[key]) {
      return false;
    }
  }
  
  return true;
};

matchers.toHaveAPrototype = function (expected) {
  return expected.isPrototypeOf(this.actual);
};

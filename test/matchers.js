var matchers = module.exports;


matchers.toBeAnInstanceOf = function (expected) {
  return this.actual instanceof expected;
};

matchers.toBeOfType = function (expected) {
  return typeof this.actual === expected;
};

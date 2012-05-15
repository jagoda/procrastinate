var matchers = module.exports;


beforeEach(function () {
  this.addMatchers(matchers);
});


matchers.toBeSimilarTo = function (expected) {
  var actual = this.actual,
      key;
      
  for (key in expected) {
    expect(actual[key]).toEqual(expected[key]);
  }
  
  return true;
};

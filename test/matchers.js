var matchers = module.exports;


matchers.toBeSimilarTo = function (expected) {
  var actual = this.actual,
      similar = true,
      key;
  
  for (key in expected) {
    if (actual[key] != expected[key]) {
      similar = false;
      break;
    }
  }
  
  return similar;
};

var matchers = module.exports;


matchers.toBeSimilarTo = function (expected) {
  var actual = this.actual,
      isSimilar = true,
      key;
      
  for (key in expected) {
    if (actual[key] != expected[key]) {
      isSimilar = false;
      break;
    }
  }
  
  return isSimilar;
};

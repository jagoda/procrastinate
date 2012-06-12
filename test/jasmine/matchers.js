beforeEach(function () {
  this.addMatchers({
  
    toBeInstanceOf: function (expected) {
      return this.actual instanceof expected;
    },
    
    toBeSimilarTo: function (expected) {
      var actual = this.actual,
      key;
      
      for (key in expected) {
        expect(actual[key]).toEqual(expected[key]);
      }
      
      return true;
    }
    
  });
});


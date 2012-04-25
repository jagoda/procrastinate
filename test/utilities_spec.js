var utilities = require('../lib/utilities');


describe("utilities", function () {

  describe("attach", function () {
    
    it("links a function with a context and an array of initial arguments", function () {
      var object = { value: 3 },
          sum = function (a, b, c) { return this.value + a + b + c; },
          attached = utilities.attach(sum, object, [ 2, 4 ]);
          
      expect(attached(1)).toEqual(10);
    });
    
  });
  
  describe("bind", function () {
  
    it("links a function with a context and initial arguments", function () {
      var object = { value: 3 },
          sum = function (a, b) { return this.value + a + b; },
          bound = utilities.bind(sum, object, 2);
          
      expect(bound(1)).toEqual(6);
    });
  
  });

});

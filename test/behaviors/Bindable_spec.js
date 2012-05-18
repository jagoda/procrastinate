var Bindable = require('../../lib/behaviors/Bindable');


describe("A Bindable object", function () {

  var bindable;
  
  beforeEach(function () {
    bindable = new Bindable();
    bindable.value = 42;
    bindable.getValue = function (a, b) {
      a = a || 0;
      b = b || 0;
      
      return this.value + a + b;
    };
  });
  
  it("can bind a method to itself by name", function () {
    var boundMethod = bindable.bind('getValue');
    
    expect(boundMethod()).toEqual(42);
    expect(boundMethod(1, 2)).toEqual(45);
  });
  
  it("can bind a named method to itself with arguments", function () {
    var boundMethod = bindable.bind('getValue', 3);
    
    expect(boundMethod()).toEqual(45);
    expect(boundMethod(2)).toEqual(47);
  });
  
  it("can bind a function to itself", function () {
    function multiply (a, b) {
      a = a || 1;
      b = b || 1;
      
      return this.value * a * b;
    }
    
    var boundFunction = bindable.bind(multiply);
    
    expect(boundFunction()).toEqual(42);
    expect(boundFunction(2)).toEqual(84);
  });
  
  it("can bind a function to itself with arguments", function () {
    function multiply (a, b) {
      a = a || 1;
      b = b || 1;
      
      return this.value * a * b;
    }
    
    var boundFunction = bindable.bind(multiply, 2);
    
    expect(boundFunction()).toEqual(84);
    expect(boundFunction(2)).toEqual(168);
  });
  
  it("can bind a method to an arbitrary context by name", function () {
    var context = { value: 3 },
        boundMethod = bindable.bind(context, 'getValue');
        
    expect(boundMethod()).toEqual(3);
    expect(boundMethod(2)).toEqual(5);
  });
  
  it("can bind a method to an arbitrary context by name with arguments", function () {
    var context = { value: 3 },
        boundMethod = bindable.bind(context, 'getValue', 3);
        
    expect(boundMethod()).toEqual(6);
    expect(boundMethod(2)).toEqual(8);
  });
  
  describe("helper", function () {
  
    it("can bind an arbitrary function to a context with arguments", function () {
      function sum (a, b) { return this.value + a + b; }
      
      var context = { value: 1 },
          bound = Bindable.bind(context, sum, 2);
      
      expect(bound(3)).toEqual(6);
      expect(bound(4)).toEqual(7);
    });
  
  });

});

var Comparable = require('../../lib/behaviors/Comparable'),
    Mixable = require('../../lib/behaviors/Mixable'),
    inject = Mixable.inject;


describe("A Mixable object", function () {

  var mixable;
  
  beforeEach(function () {
    mixable = new Mixable();
  });
  
  it("can mixin properties from an existing object", function () {
    var object = { number: 42, string: 'forty-two' };
    
    expect('number' in mixable).toBe(false);
    mixable.mixin(object);
    expect(mixable).toBeSimilarTo(object);
    expect(mixable).not.toBe(object);
  });
  
  it("can mixin an API provided by a constructor", function () {
    expect('equalTo' in mixable).toBe(false);
    mixable.mixin(Comparable, 5);
    expect(mixable.equalTo(5)).toBe(true);
  });
  
  
  describe("helper", function () {
    
    it("can inject properties from another object into a target object", function () {
      var source = { foo: 'bar', hello: 'world' },
          target = {};
          
      expect('foo' in target).toBe(false);
      inject(target).with(source);
      expect(target).toEqual(source);
      expect(target).not.toBe(source);
    });
    
    it("can inject an object with an API provided by a constructor", function () {
      var target = {};
      
      expect('equalTo' in target).toBe(false);
      inject(target).with(Comparable, 42);
      expect(target.equalTo(42)).toBe(true);
    });
    
  });

});

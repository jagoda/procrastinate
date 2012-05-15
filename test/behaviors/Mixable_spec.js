var matchers = require('../jasmine/matchers'),
    Mixable = require('../../lib/behaviors/Mixable'),
    Observable = require('../../lib/behaviors/Observable');


describe("A Mixable object", function () {

  var mixable;
  
  beforeEach(function () {
    this.addMatchers(matchers);
    mixable = new Mixable();
  });
  
  it("can mixin properties from another object", function () {
    var object = { foo: 'bar', hello: 'world', _hidden: 'not here' };
    
    expect(mixable.foo).toBeUndefined();
    mixable.mixin(object);
    expect(mixable).toBeSimilarTo({ foo: 'bar', hello: 'world' });
    expect(mixable._hidden).toBeUndefined();
  });
  
  it("can mixin in an API provided by an interface", function () {
    var result;
    
    mixable.mixin(Observable);
    mixable.observe(function () {
      result = true;
    });
    expect(result).toBeUndefined();
    
    mixable.notify();
    expect(result).toEqual(true);
  });

});

var matchers = require('./matchers'),
    Mixable = require('../lib/Mixable'),
    Observable = require('../lib/Observable');


describe("A Mixable object", function () {

  var mixbale;
  
  beforeEach(function () {
    this.addMatchers(matchers);
    mixable = new Mixable();
  });

  it("can mixin the properties of another object", function () {
    var object = { foo: 'bar', hello: 'world' };
    
    expect(mixable.foo).toBeUndefined();
    mixable.mixin(object);
    expect(mixable).toBeSimilarTo(object);
  });
  
  it("can mixin the API of another constructor", function () {
    var result;
    
    expect(mixable.observe).toBeUndefined();
    mixable.mixin(Observable);
    mixable.observe(function () {
      result = true;
    });
    expect(result).toBeUndefined();
    mixable.notify();
    expect(result).toEqual(true);
  });

});

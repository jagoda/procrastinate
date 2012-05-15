var Enumerable = require('../../lib/behaviors/Enumerable'),
    matchers = require('../jasmine/matchers'),
    Mixable = require('../../lib/behaviors/Mixable'),
    Observable = require('../../lib/behaviors/Observable'),
    inject = Mixable.inject;


describe("A Mixable object", function () {

  var mixable;
  
  beforeEach(function () {
    mixable = new Mixable();
  });
  
  it("can mixin properties from another object", function () {
    var object = { foo: 'bar', hello: 'world', _hidden: 'not here' };
    
    expect(mixable.foo).toBeUndefined();
    mixable.mixin(object);
    expect(mixable).toBeSimilarTo({ foo: 'bar', hello: 'world' });
    expect(mixable._hidden).toBeUndefined();
  });
  
  it("can mixin in an API provided by another class", function () {
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

describe("The Mixable helper", function () {
  
  it("can inject properties from another object onto an existing object", function () {
    var object1 = { foo: 'bar' },
        object2 = { hello: 'world' };
        
    expect(object1.hello).toBeUndefined();
    inject(object1).with(object2);
    expect(object1).toEqual({ foo: 'bar', hello: 'world' });
  });
  
  it("can inject class APIs into existing objects", function () {
    var object = { foo: 'bar', hello: 'world' },
        result = [];
    
    inject(object).with(Enumerable, Observable);
    object.observe(function () {
      this.forEach(function (key, value) {
        result.push([ key, value ]);
      });
    });
    expect(result.length).toEqual(0);
    
    object.notify();
    expect(result).toBeSimilarTo([
      [ 'foo', 'bar' ],
      [ 'hello', 'world' ]
    ]);
  });

});

var Enumerable = require('../lib/Enumerable');


describe("An Enumerable object", function () {

  var enumerable;
  
  beforeEach(function () {
    enumerable = new Enumerable();
    enumerable.number = 42;
    enumerable.string = 'forty-two';
  });

  it("can call a function for every key-value property pair", function () {
    var results = [];
    
    enumerable.forEach(function (key, value) {
      results.push([ key, value ]);
    });
    
    expect(results).toEqual([
      [ 'number', 42 ],
      [ 'string', 'forty-two' ]
    ]);
  });
  
  it("can wrap an existing object", function () {
    var object = { foo: 'bar', hello: 'world' },
        enumerable = new Enumerable(object),
        results = [];
        
    enumerable.forEach(function (key, value) {
      results.push([ key, value ]);
    });
    
    expect(results).toEqual([
      [ 'foo', 'bar' ],
      [ 'hello', 'world' ]
    ]);
  });

});

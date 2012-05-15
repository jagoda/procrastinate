var Enumerable = require('../../lib/behaviors/Enumerable');


describe("An Enumerable object", function () {

  var enumerable;
  
  beforeEach(function () {
    enumerable = new Enumerable();
    enumerable.number = 42;
    enumerable.string = 'forty-two';
  });
  
  it("can execute a callback for each key-value pair on itself", function () {
    var result = {};
    
    expect(result.number).toBeUndefined();
    enumerable.forEach(function (key, value) {
      result[key] = value;
    });
    expect(result).toBeSimilarTo({ number: 42, string: 'forty-two' });
  });
  
  it("can wrap an existing object", function () {
    var object = { foo: 'bar', hello: 'world' },
        result = {};
        
    enumerable = Enumerable.wrap(object);
    expect(result.foo).toBeUndefined();
    
    enumerable.forEach(function (key, value) {
      result[key] = value;
    });
    expect(result).toBeSimilarTo(object);
  });

});

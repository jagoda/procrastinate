var Enumerable = require('../../lib/behaviors/Enumerable');


describe("An Enumerable object", function () {

  var enumerable;
  
  beforeEach(function () {
    enumerable = new Enumerable();
    enumerable.number = 42;
    enumerable.string = 'forty-two';
  });

  it("can execute a callback for all key-value pairs on itelf", function () {
    var result = {};
    
    expect(result).toEqual({});
    enumerable.forEach(function (key, value) {
      if (this.hasOwnProperty(key) && key[0] != '_') {
        result[key] = value;
      }
    });
    expect(result).toEqual({ number: 42, string: 'forty-two' });
  });
  
  it("can wrap an existing object", function () {
    var object = { foo: 'bar', hello: 'world' },
        enumerable = new Enumerable(object),
        result = {};
        
    expect(result).toEqual({});
    enumerable.forEach(function (key, value) {
      if (this.hasOwnProperty(key)) {
        result[key] = value;
      }
    });
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
  });

});

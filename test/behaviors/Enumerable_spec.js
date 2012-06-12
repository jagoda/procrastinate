var Enumerable = require('../../lib/behaviors/Enumerable'),
    forEachKeyIn = Enumerable.forEachKeyIn,
    forEachValueIn = Enumerable.forEachValueIn,
    forEachPairIn = Enumerable.forEachPairIn;


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
  
  describe("helpers", function () {
  
    it("can execute a function for each key in an object using natural language", function () {
      var keys = [],
          object = { 'one': 1, 'two': 2, 'three': 3 };
      
      expect(keys.length).toEqual(0);
      forEachKeyIn(object).do(function (key) {
        keys.push(key);
      });
      expect(keys).toEqual([ 'one', 'two', 'three' ]);
    });
    
    it("can execute a function for each value in an object using natural language", function () {
      var values = [],
          object = { 'one': 1, 'two': 2, 'three': 3 };
      
      expect(values.length).toEqual(0);
      forEachValueIn(object).do(function (value) {
        values.push(value);
      });
      expect(values).toEqual([ 1, 2, 3 ]);
    });
    
    it("can execute a function for each key-value pair in an object using natural language", function () {
      var pairs = [],
          object = { 'one': 1, 'two': 2, 'three': 3 };
      
      expect(pairs.length).toEqual(0);
      forEachPairIn(object).do(function (key, value) {
        pairs.push([ key, value ]);
      });
      expect(pairs).toEqual([
        [ 'one', 1 ],
        [ 'two', 2 ],
        [ 'three', 3 ]
      ]);
    });
  
  });

});

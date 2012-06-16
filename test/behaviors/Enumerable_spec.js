var Enumerable = require('../../lib/behaviors/Enumerable'),
    forEach = Enumerable.forEach;


describe("An Enumerable object", function () {

  var enumerable;
  
  beforeEach(function () {
    enumerable = new Enumerable();
    enumerable.number = 42;
    enumerable.string = 'forty-two';
    
    Object.defineProperty(enumerable, 'foo', {
      configurable: true,
      enumerable: false,
      value: 'bar'
    });
  });
  
  it("can execute a callback for all public keys on itself", function () {
    var result = {};
    
    Object.defineProperty(enumerable, 'bomb', {
      configurable: true,
      enumerable: true,
      
      get: function () {
        throw new Error("Key evaluated");
      }
    });
    
    expect(result).toEqual([]);
    enumerable.key(function (key) {
      result[key] = true;
    });
    expect(result).toEqual({ bomb: true, number: true, string: true });
  });
  
  it("can execute a callback for all public values on itself", function () {
    var result = {};
    
    expect(result).toEqual({});
    enumerable.value(function (value) {
      result[value] = true;
    });
    expect(result).toEqual({ 42: true, 'forty-two': true });
  });
  
  it("can execute a callback for all public key-value pairs on itself", function () {
    var count = 0,
        result = {};
    
    Object.defineProperty(enumerable, 'compute', {
      configurable: true,
      enumerable: true,
      
      get: function () {
        return count++;
      }
    });
    
    expect(result).toEqual({});
    enumerable.mapping(function (key, value) {
      result[key] = value;
    });
    expect(result).toEqual({ number: 42, string: 'forty-two', compute: 0 });
    expect(count).not.toEqual(result.compute);
    expect(count).toEqual(1);
  });
  
  it("can execute a callback for all properties on itself", function () {
    var result = {};
    
    function test () { return 'this is a test'; }
    
    Object.defineProperty(enumerable, 'test', {
      configurable: true,
      enumerable: true,
      
      get: test
    });
    
    expect(result).toEqual({});
    enumerable.property(function (name, descriptor) {
      if (name[0] === '_') {
        result[name] = true;
      }
      else {
        if (descriptor.get) {
          result[name] = descriptor.get;
        }
        else {
          result[name] = descriptor.value;
        }
      }
    });
    expect(result).toEqual({
      foo: 'bar',
      number: 42,
      string: 'forty-two',
      test: test,
      _value: true
    });
    expect(result.test()).toEqual('this is a test');
  });
  
  it("can wrap an existing object", function () {
    var object = { foo: 'bar', hello: 'world' },
        enumerable = new Enumerable(object),
        result = {};
        
    expect(result).toEqual({});
    enumerable.mapping(function (key, value) {
      if (this.hasOwnProperty(key)) {
        result[key] = value;
      }
    });
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
  });
  
  describe("using natural language", function () {
  
    var object;
    
    beforeEach(function () {
      object = {
        number: 42,
        string: 'forty-two',
        _value: 'private'
      };
      
      Object.defineProperty(object, 'foo', {
        configurable: true,
        enumerable: false,
        value: 'bar'
      });
    });
  
    it("can execute a function for each key on an object", function () {
      var result = {};
      
      Object.defineProperty(object, 'bomb', {
        configurable: true,
        enumerable: true,
        
        get: function () {
          throw new Error("Key evaluated");
        }
      });
      
      expect(result).toEqual({});
      forEach('key').on(object).do(function (key) {
        result[key] = true;
      });
      expect(result).toEqual({ bomb: true, number: true, string: true });
    });
    
    it("can execute a function for each value on an object", function () {
      var result = {};
    
      expect(result).toEqual({});
      forEach('value').on(object).do(function (value) {
        result[value] = true;
      });
      expect(result).toEqual({ 42: true, 'forty-two': true });
    });
    
    it("can executen a function for each key-value pair on an object", function () {
      var count = 0,
        result = {};
    
      Object.defineProperty(object, 'compute', {
        configurable: true,
        enumerable: true,
        
        get: function () {
          return count++;
        }
      });
      
      expect(result).toEqual({});
      forEach('mapping').on(object).do(function (key, value) {
        result[key] = value;
      });
      expect(result).toEqual({ number: 42, string: 'forty-two', compute: 0 });
      expect(count).not.toEqual(result.compute);
      expect(count).toEqual(1);
    });
    
    it("can execute a function for each property on an object", function () {
      var result = {};
    
      function test () { return 'this is a test'; }
      
      Object.defineProperty(object, 'test', {
        configurable: true,
        enumerable: true,
        
        get: test
      });
      
      expect(result).toEqual({});
      forEach('property').on(object).do(function (name, descriptor) {
        if (name[0] === '_') {
          result[name] = true;
        }
        else {
          if (descriptor.get) {
            result[name] = descriptor.get;
          }
          else {
            result[name] = descriptor.value;
          }
        }
      });
      expect(result).toEqual({
        foo: 'bar',
        number: 42,
        string: 'forty-two',
        test: test,
        _value: true
      });
      expect(result.test()).toEqual('this is a test');
    });
  
  });

});

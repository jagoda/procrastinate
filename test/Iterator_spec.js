var Iterator = require('../lib/Iterator');


describe("Iterator", function () {

  var subject;

  beforeEach(function () {
    subject = { one: 1, two: 2, three: 3 };
  });
  
  it("can create a copy of an object", function () {
    var copy = Iterator.copy(subject);
    
    expect(copy).toEqual(subject);
    expect(copy).not.toBe(subject);
  });
  
  it("can copy an object and assign a prototype", function () {
    var parent = { foo: 'bar' },
        child = Iterator.copy(subject, parent);
        
    expect(child).toEqual({ foo: 'bar', one: 1, two: 2, three: 3 });
    expect(child.hasOwnProperty('foo')).toBeFalsy();
    expect(parent.isPrototypeOf(child)).toBeTruthy();
  });
  
  it("can execute a callback for each key-value pair on an object", function () {
    var string = '',
        sum = 0;
        
    Iterator.forEach(subject, function (key, value) {
      expect(this[key]).toEqual(value);
      string += key;
      sum += value;
    });
    
    expect(string).toEqual('onetwothree');
    expect(sum).toEqual(6);
  });
  
  it("can use a function to map one object to another", function () {
    var mappedObject = Iterator.map(subject, function (key, value) {
      return key + value;
    });
    
    expect(mappedObject).toEqual({ one: 'one1', two: 'two2', three: 'three3' });
  });
  
  it("can create a mapped object with a prototype", function () {
    var parent = { foo: 'bar' },
        child = Iterator.map(subject, function (key, value) {
            return key + value;
          },
          parent
        );
        
    expect(child).toEqual({
      foo: 'bar',
      one: 'one1',
      two: 'two2',
      three: 'three3'
    });
    expect(child.hasOwnProperty('foo')).toBeFalsy();
    expect(parent.isPrototypeOf(child));
  });
  
  it("can mix properties from other objects into a given object", function () {
    var one = { foo: 'bar' },
        two = { hello: 'world' },
        three = { five: 5 },
        mixed = Iterator.mixin(one, two, three);
        
    expect(mixed).toEqual({ foo: 'bar', hello: 'world', five: 5 });
    expect(mixed).toBe(one);
  });
  
  it("can create a copy of an object only including filtered propreties", function () {
    var filteredCopy = Iterator.filter(subject, function (key, value) {
      console.log(key, value, this[key]);
      return this[key] == 2 && value == 2;
    });
    
    expect(filteredCopy).toEqual({ two: 2 });
  });
  
  it("can create a filtered copy with a given prototype", function () {
    var parent = { foo: 'bar' },
        child = Iterator.filter(subject, function (key, value) {
          return value == 3;
        }, parent);
        
    expect(child).toEqual({ foo: 'bar', three: 3 });
    expect(child.hasOwnProperty('foo')).toBeFalsy();
    expect(parent.isPrototypeOf(child)).toBeTruthy();
  });

});

describe("An Iterator", function () {

  var iterator, subject;

  beforeEach(function () {
    subject = { one: 1, two: 2, three: 3 };
    iterator = new Iterator(subject);
  });
  
  it("can create a copy of an object", function () {
    var copy = iterator.copy();
    
    expect(copy).toEqual(subject);
    expect(copy).not.toBe(subject);
  });
  
  it("can copy an object and assign a prototype", function () {
    var parent = { foo: 'bar' },
        child = iterator.copy(parent);
        
    expect(child).toEqual({ foo: 'bar', one: 1, two: 2, three: 3 });
    expect(child.hasOwnProperty('foo')).toBeFalsy();
    expect(parent.isPrototypeOf(child)).toBeTruthy();
  });
  
  it("can execute a callback for each key-value pair on an object", function () {
    var string = '',
        sum = 0;
        
    iterator.forEach(function (key, value) {
      expect(this[key]).toEqual(value);
      string += key;
      sum += value;
    });
    
    expect(string).toEqual('onetwothree');
    expect(sum).toEqual(6);
  });
  
  it("can use a function to map one object to another", function () {
    var mappedObject = iterator.map(function (key, value) {
      return key + value;
    });
    
    expect(mappedObject).toEqual({ one: 'one1', two: 'two2', three: 'three3' });
  });
  
  it("can create a mapped object with a prototype", function () {
    var parent = { foo: 'bar' },
        child = iterator.map(function (key, value) {
            return key + value;
          },
          parent
        );
        
    expect(child).toEqual({
      foo: 'bar',
      one: 'one1',
      two: 'two2',
      three: 'three3'
    });
    expect(child.hasOwnProperty('foo')).toBeFalsy();
    expect(parent.isPrototypeOf(child));
  });
  
  it("can project its properties onto another object", function () {
    var object = { foo: 'bar' },
        projection = iterator.inject(object);
        
    expect(projection).toEqual({ foo: 'bar', one: 1, two: 2, three: 3 });
    expect(projection).toBe(object);
  });
  
  it("can create a new object with filtered values", function () {
    var filteredCopy = iterator.filter(function (key, value) {
      return this[key] == 2 && value == 2;
    });
    
    expect(filteredCopy).toEqual({ two: 2 });
  });
  
  it("can create a filtered copy with a given prototype", function () {
    var parent = { foo: 'bar' },
        child = iterator.filter(function (key, value) {
          return value == 3;
        }, parent);
        
    expect(child).toEqual({ foo: 'bar', three: 3 });
    expect(child.hasOwnProperty('foo')).toBeFalsy();
    expect(parent.isPrototypeOf(child)).toBeTruthy();
  });

});

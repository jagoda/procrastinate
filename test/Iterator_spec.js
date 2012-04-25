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

});

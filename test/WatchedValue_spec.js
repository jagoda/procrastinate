var matchers = require('./matchers'),
    WatchedValue = require('../lib/WatchedValue');


describe("A WatchedValue", function () {

  var watchedValue;

  beforeEach(function () {
    this.addMatchers(matchers);
    watchedValue = new WatchedValue(5);
  });
  
  it("has a current value", function () {
    expect(watchedValue.value()).toEqual(5);
  });
  
  it("can change its value", function () {
    expect(watchedValue.value()).toEqual(5);
    watchedValue.update('five');
    expect(watchedValue.value()).toEqual('five');
  });
  
  it("can change its value in the future", function () {
    var changeValue = watchedValue.willBe('five');
    
    expect(changeValue).toBeOfType('function');
    expect(watchedValue.value()).toEqual(5);
    changeValue();
    expect(watchedValue.value()).toEqual('five');
  });
  
  it("can perform tests", function () {
    expect(watchedValue.is()).toBeAnInstanceOf(WatchedValue);
    expect(watchedValue.is().equalTo).toBeOfType('function');
  });
    
  it("can check for equality", function () {
    expect(watchedValue.is().equalTo(5)).toBeTruthy();
    expect(watchedValue.is().equalTo('five')).toBeFalsy();
  });
  
  it("can negate tests", function () {
    expect(watchedValue.isNot()).toBeAnInstanceOf(WatchedValue);
    expect(watchedValue.isNot().equalTo).toBeOfType('function');
    
    expect(watchedValue.is().not()).toBeAnInstanceOf(WatchedValue);
    expect(watchedValue.is().not().equalTo).toBeOfType('function');
    
    expect(watchedValue.is().equalTo(5)).toBeTruthy();
    expect(watchedValue.is().not().equalTo(5)).toBeFalsy();
    expect(watchedValue.is().not().not().equalTo(5)).toBeTruthy();
  });
   
  it("can check for equality in the future", function () {
    var isEqual = watchedValue.toBe().equalTo('five');
    
    expect(isEqual()).toBeFalsy();
    watchedValue.update('five');
    expect(isEqual()).toBeTruthy();
  });
  
  it("can negate future tests", function () {
    var isEqual = watchedValue.toBe().equalTo('five'),
        isNotEqual = watchedValue.toBe().not().equalTo('five'),
        isNotNotEqual = watchedValue.toBe().not().not().equalTo('five');
        
    expect(isEqual()).toBeFalsy();
    expect(isNotEqual()).toBeTruthy();
    expect(isNotNotEqual()).toBeFalsy();
  });
  
  it("can check if the value is defined", function () {
    expect(watchedValue.is().defined()).toBeTruthy();
    watchedValue.update();
    expect(watchedValue.is().defined()).toBeFalsy();
  });
  
  it("can check if the value is defined in the future", function () {
    var isDefined = watchedValue.toBe().defined();
    
    expect(isDefined()).toBeTruthy();
    watchedValue.update();
    expect(isDefined()).toBeFalsy();
  });
  
  it("can check if the value is falsy", function () {
    expect(watchedValue.is().falsy()).toBeFalsy();
    watchedValue.update();
    expect(watchedValue.is().falsy()).toBeTruthy();
  });
  
  it("can check if the value is falsy in the future", function () {
    var isFalsy = watchedValue.toBe().falsy();
    
    expect(isFalsy()).toBeFalsy();
    watchedValue.update();
    expect(isFalsy()).toBeTruthy();
  });
  
  it("can check if the value is truthy", function () {
    expect(watchedValue.is().truthy()).toBeTruthy();
    watchedValue.update();
    expect(watchedValue.is().truthy()).toBeFalsy();
  });
  
  it("can check if the value is truthy in the future", function () {
    var isTruthy = watchedValue.toBe().truthy();
    
    expect(isTruthy()).toBeTruthy();
    watchedValue.update();
    expect(isTruthy()).toBeFalsy();
  });

});

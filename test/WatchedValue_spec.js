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
  
  it("can have its value changed by an asynchronous function", function () {
    runs(function () {
      expect(watchedValue.value()).toEqual(5);
      setTimeout(watchedValue.update, 1000);
    });
    waitsFor(watchedValue.toNotBe().defined(), "value to change", 2000);
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
  
  it("can trigger an action when equality is satisfied", function () {
    var result = new WatchedValue();
    
    WatchedValue.when(watchedValue).is().equalTo('five').
      then(result.update);
    expect(watchedValue.value()).toEqual(5);
    expect(result.value()).toBeUndefined();
    watchedValue.update('five');
    expect(watchedValue.value()).toEqual('five');
    expect(result.value()).toEqual('five');
  });
  
  it("can trigger an action after equality is already satisfied", function () {
    var result = new WatchedValue();
    
    expect(result.value()).toBeUndefined();
    expect(watchedValue.value()).toEqual(5);
    WatchedValue.when(watchedValue).is().equalTo(5).then(result.update);
    expect(result.value()).toEqual(5);
  });
  
  it("can trigger an action even when the update method is bound before hand", function () {
    var result = new WatchedValue(true),
        update = watchedValue.update;
        
    WatchedValue.when(watchedValue).is().falsy().then(result.update);
    update();
    expect(result.value()).toBeUndefined();
  });
  
  it("can handle multiple triggers", function () {
    var triggered1 = new WatchedValue(false),
        triggered2 = new WatchedValue(false);
        
    WatchedValue.when(watchedValue).is().equalTo(42).then(triggered1.update);
    WatchedValue.when(watchedValue).is().equalTo(43).then(triggered2.update);
    expect(watchedValue.value()).toEqual(5);
    expect(triggered1.value()).toBeFalsy();
    expect(triggered2.value()).toBeFalsy();
    
    watchedValue.update(43);
    expect(watchedValue.value()).toEqual(43);
    expect(triggered1.value()).toBeFalsy();
    expect(triggered2.value()).toEqual(43);
    
    watchedValue.update(42);
    expect(watchedValue.value()).toEqual(42);
    expect(triggered1.value()).toEqual(42);
    expect(triggered2.value()).toEqual(43);
  });
  
  it("handles triggers in the order registered", function () {
    var values = [];
    
    WatchedValue.when(watchedValue).is().equalTo(42).then(function () {
      values.push(1);
    });
    WatchedValue.when(watchedValue).is().equalTo(42).then(function () {
      values.push(2);
    });
    expect(watchedValue.value()).toEqual(5);
    expect(values).toEqual([]);
    
    watchedValue.update(42);
    expect(watchedValue.value()).toEqual(42);
    expect(values).toEqual([ 1, 2 ]);
  });
  
  it("can handle multiple negated triggers", function () {
    var triggered1 = new WatchedValue(false),
        triggered2 = new WatchedValue(false);
        
    WatchedValue.when(watchedValue).is().not().truthy().then(triggered1.update);
    WatchedValue.when(watchedValue).is().not().equalTo(5).then(triggered2.update);
    expect(watchedValue.value()).toEqual(5);
    expect(triggered1.value()).toBeFalsy();
    expect(triggered2.value()).toBeFalsy();
    
    watchedValue.update('');
    expect(watchedValue.value()).toBe('');
    expect(triggered1.value()).toEqual('');
    expect(triggered2.value()).toEqual('');
  });
  
  it("can handled multiple mixed triggers", function () {
    var triggered1 = new WatchedValue(false),
        triggered2 = new WatchedValue(false);
        
    WatchedValue.when(watchedValue).is().not().equalTo(5).then(triggered1.update);
    WatchedValue.when(watchedValue).is().equalTo(42).then(triggered2.update);
    expect(watchedValue.value()).toEqual(5);
    expect(triggered1.value()).toBeFalsy();
    expect(triggered2.value()).toBeFalsy();
    
    watchedValue.update(3);
    expect(watchedValue.value()).toEqual(3);
    expect(triggered1.value()).toEqual(3);
    expect(triggered2.value()).toBeFalsy();
    
    watchedValue.update(42);
    expect(watchedValue.value()).toEqual(42);
    expect(triggered1.value()).toEqual(3);
    expect(triggered2.value()).toEqual(42);
  });
  
  it("can negate future tests", function () {
    var isEqual = watchedValue.toBe().equalTo('five'),
        isNotEqual = watchedValue.toBe().not().equalTo('five'),
        isNotNotEqual = watchedValue.toBe().not().not().equalTo('five');
        
    expect(isEqual()).toBeFalsy();
    expect(isNotEqual()).toBeTruthy();
    expect(isNotNotEqual()).toBeFalsy();
  });
  
  it("can negate trigger conditions", function () {
    var result = new WatchedValue();
    
    WatchedValue.when(watchedValue).is().not().equalTo(5).
      then(result.update);
    expect(watchedValue.value()).toEqual(5);
    expect(result.value()).toBeUndefined();
    watchedValue.update('five');
    expect(watchedValue.value()).toEqual('five');
    expect(result.value()).toEqual('five');
  });
  
  it("can double negate trigger conditions", function () {
    var result = new WatchedValue();
    
    WatchedValue.when(watchedValue).is().not().not().equalTo('five').
      then(result.update);
    expect(watchedValue.value()).toEqual(5);
    expect(result.value()).toBeUndefined();
    watchedValue.update('five');
    expect(watchedValue.value()).toEqual('five');
    expect(result.value()).toEqual('five');
  });
  
  it("can trigger an action after a negated test is already satisfied", function () {
    var result = new WatchedValue();
    
    expect(result.value()).toBeUndefined();
    expect(watchedValue.value()).toEqual(5);
    WatchedValue.when(watchedValue).is().not().equalTo('five').then(result.update);
    expect(result.value()).toEqual(5);
  });
  
  it("can trigger an action after a double negated test is already satisfied", function () {
    var result = new WatchedValue();
    
    expect(result.value()).toBeUndefined();
    expect(watchedValue.value()).toEqual(5);
    WatchedValue.when(watchedValue).is().not().not().equalTo(5).then(result.update);
    expect(result.value()).toEqual(5);
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
  
  it("can trigger an action when the value is defined", function () {
    var result = new WatchedValue();
    
    watchedValue.update();
    WatchedValue.when(watchedValue).is().defined().then(result.update);
    expect(result.value()).toBeUndefined();
    watchedValue.update(42);
    expect(result.value()).toEqual(42);
  });
  
  it("can trigger an action after the value is already defined", function () {
    var result = new WatchedValue();
    
    expect(watchedValue.value()).toEqual(5);
    WatchedValue.when(watchedValue).is().defined().then(result.update);
    expect(result.value()).toEqual(5);
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
  
  it("can trigger an action when the value is falsy", function () {
    var result = new WatchedValue(true);
    
    expect(watchedValue.value()).toBeTruthy();
    WatchedValue.when(watchedValue).is().falsy().then(result.update);
    watchedValue.update(false);
    expect(result.value()).toBe(false);
  });
  
  it("can trigger an action when the value is already falsy", function () {
    var result = new WatchedValue(true);
    
    watchedValue.update()
    WatchedValue.when(watchedValue).is().falsy().then(result.update);
    expect(result.value()).toBeUndefined();
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
  
  it("can trigger an action when the value is truthy", function () {
    var result = new WatchedValue();
    
    watchedValue.update();
    WatchedValue.when(watchedValue).is().truthy().then(result.update);
    expect(result.value()).toBeUndefined();
    watchedValue.update(1);
    expect(result.value()).toEqual(1);
  });
  
  it("can trigger an action when the value is already truthy", function () {
    var result = new WatchedValue();
    
    WatchedValue.when(watchedValue).is().truthy().then(result.update);
    expect(result.value()).toEqual(5);
  });

});

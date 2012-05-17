var DeferredOperation = require('../lib/DeferredOperation'),
    WatchedValue = require('../lib/WatchedValue'),
    when = DeferredOperation.when;


describe("A DeferredOperation", function () {

  var deferred;
  
  beforeEach(function () {
    deferred = new DeferredOperation();
  });
  
  it("can schedule callbacks before being resolved", function () {
    var result1, result2;
    
    deferred.then(function () {
      result1 = arguments;
    });
    deferred.then(function () {
      result2 = arguments;
    });
    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
    
    deferred.resolve(1, 2, 3);
    expect(result1).toEqual([ 1, 2, 3 ]);
    expect(result2).toEqual([ 1, 2, 3 ]);
  });
  
  it("can schedule a callback after being resolved", function () {
    var result;
    
    deferred.resolve(1, 2, 3);
    expect(result).toBeUndefined();
    
    deferred.then(function () {
      result = arguments;
    });
    expect(result).toEqual([ 1, 2, 3 ]);
  });
  
  it("can only be resolved once", function () {
    var count = 0;
    
    deferred.then(function () {
      count++;
    });
    expect(count).toEqual(0);
    
    deferred.resolve();
    expect(count).toEqual(1);
    
    deferred.resolve();
    expect(count).toEqual(1);
  });
  
  it("can be rejected after scheduling callbacks", function () {
    throw "Implement";
  });
  
  it("can be rejected before scheduling callbacks", function () {
    throw "Implement";
  });
  
  it("can only be rejected once", function () {
    throw "Implement";
  });
  
  it("cannot be resolved after it has been rejected", function () {
    throw "Implement";
  });
  
  it("cannot be rejected after it has been resolved", function () {
    throw "Implement";
  });
  
  it("can customize its rejection handling", function () {
    throw "Implement";
  });
  
  it("can be chained with other deferred operations", function () {
    var chainedDeferred, result;
    
    chainedDeferred = deferred.then(function (value) {
      expect(this).toBeInstanceOf(DeferredOperation);
      expect(this).not.toBe(deferred);
      
      this.resolve(value + 1);
    });
    chainedDeferred.then(function (value) {
      result = value;
    });
    expect(result).toBeUndefined();
    
    deferred.resolve(42);
    expect(result).toEqual(43);
  });
  
  describe("helper", function () {
    
    it("can wait for a WatchedValue to satisfy a positive condition", function () {
      var watchedValue = new WatchedValue(),
          result;
          
      when(watchedValue).is().equalTo(42).then(function () {
        result = arguments;
      });
      expect(result).toBeUndefined();
      
      watchedValue.update(43);
      expect(result).toBeUndefined();
      
      watchedValue.update(42);
      expect(result).toEqual([ watchedValue ]);
    });
    
    it("can wait for a WatchedValue to satisfy a negative condition", function () {
      var watchedValue = new WatchedValue(42),
          result;
          
      when(watchedValue).is().not().equalTo(42).then(function () {
        result = arguments;
      });
      expect(result).toBeUndefined();
      
      watchedValue.update(42);
      expect(result).toBeUndefined();
      
      watchedValue.update();
      expect(result).toEqual([ watchedValue ]);
    });
    
    it("can wait for a WatchedValue to satisfy a double-negative condition", function () {
      var watchedValue = new WatchedValue(),
          result;
          
      when(watchedValue).is().not().not().equalTo(42).then(function () {
        result = arguments;
      });
      expect(result).toBeUndefined();
      
      watchedValue.update(43);
      expect(result).toBeUndefined();
      
      watchedValue.update(42);
      expect(result).toEqual([ watchedValue ]);
    });
    
  });

});

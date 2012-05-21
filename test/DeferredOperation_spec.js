var DeferredOperation = require('../lib/DeferredOperation'),
    WatchedValue = require('../lib/WatchedValue'),
    update = WatchedValue.update,
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
  
  it("can be rejected with a string message", function () {
    var result;
    
    deferred.then(function () { throw new Error("FIRED!"); });
    deferred.otherwise(function (rejection) { result = rejection; });
    expect(result).toBeUndefined();
    
    deferred.reject("Rejected as expected.");
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toEqual("Rejected as expected.");
  });
  
  it("can be rejected with an Error object", function () {
    var error = new Error(),
        result;
    
    deferred.then(function () { throw new Error("FIRED!"); });
    deferred.otherwise(function (rejection) { result = rejection; });
    expect(result).toBeUndefined();
    
    deferred.reject(error);
    expect(result).toBe(error);
  });
  
  it("can be rejected before registering handlers", function () {
    var result;
    
    deferred.reject("You are rejected.");
    deferred.then(function () { throw new Error("FIRED!"); });
    expect(result).toBeUndefined();
    
    deferred.otherwise(function (rejection) { result = rejection; });
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toEqual("You are rejected.");
  });
  
  it("can only be rejected once", function () {
    var count = 0;
    
    deferred.otherwise(function () { count++; });
    expect(count).toEqual(0);
    
    deferred.reject();
    expect(count).toEqual(1);
    
    deferred.reject();
    expect(count).toEqual(1);
  });
  
  it("cannot be resolved after it has been rejected", function () {
    var result;
    
    deferred.then(function () { throw new Error("FIRED!"); });
    deferred.otherwise(function () { result = true; });
    expect(result).toBeUndefined();
    
    deferred.reject();
    deferred.resolve();
    expect(result).toBe(true);
  });
  
  it("cannot be rejected after it has been resolved", function () {
    var result;
    
    deferred.then(function () { result = true; });
    deferred.otherwise(function () { throw new Error("REJECTED!"); });
    expect(result).toBeUndefined();
    
    deferred.resolve();
    deferred.reject();
    expect(result).toBe(true);
  });
  
  it("will ignore callbacks after being rejected", function () {
    deferred.reject();
    deferred.then(function () { throw new Error("FIRED!"); });
  });
  
  it("will ignore rejection handlers after being resolved", function () {
    deferred.resolve();
    deferred.otherwise(function () { throw new Error("REJECTED!"); });
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
  
  it("can be resolved by a callback", function () {
    var result;
    
    function execute (callback) {
      callback(42);
    }
    
    deferred.then(function (value) { result = value; });
    expect(result).toBeUndefined();
    
    execute(deferred.callback());
    expect(result).toEqual(42);
  });
  
  it("can be rejected by a callback", function () {
    var result;
    
    function execute (callback) {
      callback("You are rejected.");
    }
    
    deferred.otherwise(function (rejection) { result = rejection; });
    expect(result).toBeUndefined();
    
    execute(deferred.errback());
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toEqual("You are rejected.");
  });
  
  it("can be resolved by a notifying callback", function () {
    var result;
    
    function execute (callback) {
      callback(null, 42);
    };
    
    deferred.then(function (value) { result = value; });
    expect(result).toBeUndefined();
    
    execute(deferred.handler());
    expect(result).toEqual(42);
  });
  
  it("can be rejected by a notifying callback", function () {
    var error = new Error(),
        result;
    
    function execute (callback) {
      callback(error);
    };
    
    deferred.otherwise(function (rejection) { result = rejection; });
    expect(result).toBeUndefined();
    
    execute(deferred.handler());
    expect(result).toBe(error);
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
    
    it("can wait for a condition that is already satisfied", function () {
      var watchedValue = new WatchedValue(42),
          result;
      
      expect(result).toBeUndefined();
      when(watchedValue).is().equalTo(42).then(function () {
        result = true;
      });
      expect(result).toBe(true);
    });
    
    it("resolves with the original WatchedValue when waiting on a condition", function () {
      var watchedValue = new WatchedValue(),
          result;
          
      when(watchedValue).is().defined().then(function (value) {
        result = value;
      });
      expect(result).toBeUndefined();
      
      update(watchedValue).toBe(true);
      expect(result).toBe(watchedValue);
    });
    
    it("resolves with the original WatchedValue when waiting on a satisfied condition", function () {
      var watchedValue = new WatchedValue(true),
          result;
         
      expect(result).toBeUndefined(); 
      when(watchedValue).is().defined().then(function (value) {
        result = value;
      });
      expect(result).toBe(watchedValue);
    });
    
  });

});

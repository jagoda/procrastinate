var Deferred = require('../lib/Deferred'),
    WatchedValue = require('../lib/WatchedValue');


describe("A Deferred", function () {

  var deferred;

  beforeEach(function () {
    deferred = new Deferred();
  });
  
  it("will throw an error if rejected with an Error", function () {
    var error = new Error("the sting of rejection");
    
    expect(function () {
      deferred.reject(error);
    }).toThrow(error);
  });
  
  it("will throw an error with a rejection comment if rejected", function () {
    expect(function () {
      deferred.reject("you are the weakest link");
    }).toThrow(new Error("you are the weakest link"));
  });
  
  it("cannot be resolved after it has been rejected", function () {
    var resolved = new WatchedValue(false);
    
    deferred.then(resolved.willBe(true));
    try {
      deferred.reject();
    } catch (error) {
    }
    expect(resolved.value()).toBeFalsy();
    deferred.resolve();
    
    expect(resolved.value()).toBeFalsy();
  });
  
  it("cannot be rejected after it has been resolved", function () {
    var resolution = new WatchedValue();
    
    deferred.resolve(42);
    deferred.reject();
    expect(resolution.value()).toBeUndefined();
    deferred.then(resolution.update);
    
    expect(resolution.value()).toEqual(42);
  });
  
  it("cannot be rejected from a callback", function () {
    deferred.then(function () {
      deferred.reject("was rejected from a callback");
    });
    deferred.resolve();
  });
  
  it("can have a custom error handler", function () {
    var failed = new WatchedValue(false);
    
    deferred.otherwise(failed.willBe(true));
    expect(failed.value()).toBeFalsy();
    deferred.reject();
    
    expect(failed.value()).toBeTruthy();
  });

  it("can schedule a callback to be handled in the future", function () {
    var resolved = false;
    
    deferred.then(function () { resolved = true; });
    expect(resolved).toBeFalsy();
    deferred.resolve();
    
    expect(resolved).toBeTruthy();
  });
  
  it("can schedule a callback after it has been resolved", function () {
    var resolved = false;
    
    deferred.resolve();
    expect(resolved).toBeFalsy();
    deferred.then(function () { resolved = true; });
    
    expect(resolved).toBeTruthy();
  });
  
  it("can schedule a callback before it has been resolved with an argument",
    function () {
      var resolution;
      
      deferred.then(function (value) { resolution = value; });
      expect(resolution).toBeUndefined();
      deferred.resolve(42);
      
      expect(resolution).toEqual(42);
    }
  );
  
  it("can schedule a callback after it has been resolved with an argument",
    function () {
      var resolution;
      
      deferred.resolve(42);
      expect(resolution).toBeUndefined();
      deferred.then(function (value) { resolution = value; });
      
      expect(resolution).toEqual(42);
    }
  );
  
  it("can schedule a callback before it has been resolved with arguments",
    function () {
      var resolution;
      
      deferred.then(function () { resolution = arguments; });
      expect(resolution).toBeUndefined();
      deferred.resolve('a', 'b', 'c');
      
      expect(resolution).toEqual([ 'a', 'b', 'c' ]);
    }
  );
  
  it("can schedule a callback after it has been resolved with arguments",
    function () {
      var resolution;
      
      deferred.resolve('a', 'b', 'c');
      expect(resolution).toBeUndefined();
      deferred.then(function () { resolution = arguments; });
      
      expect(resolution).toEqual([ 'a', 'b', 'c' ]);
    }
  );
  
  it("cannot be resolved more than once", function () {
    var count = 0;
    
    deferred.then(function () { count++; });
    expect(count).toEqual(0);
    deferred.resolve();
    expect(count).toEqual(1);
    deferred.resolve();
    
    expect(count).toEqual(1);
  });
  
  it("can handle multiple callbacks before resolution", function () {
    var count = 0;
    
    deferred.then(function () { count++; });
    deferred.then(function () { count += 2; });
    expect(count).toEqual(0);
    deferred.resolve();
    
    expect(count).toEqual(3);
  });
  
  it("can handle multiple callbacks after resolution", function () {
    var count = 0;
    
    deferred.resolve();
    expect(count).toEqual(0);
    deferred.then(function () { count++; });
    expect(count).toEqual(1);
    deferred.then(function () { count += 2; });
    
    expect(count).toEqual(3);
  });
  
  it("can handle multiple callbacks before resolution with an argument",
    function () {
      var count = 0;
      
      deferred.then(function (value) { count += value; });
      deferred.then(function (value) { count += value; });
      expect(count).toEqual(0);
      deferred.resolve(42);
      
      expect(count).toEqual(84);
    }
  );
  
  it("can handle multiple callbacks after resolution with an argument",
    function () {
      var count = 0;
      
      deferred.resolve(42);
      expect(count).toEqual(0);
      deferred.then(function (value) { count += value; });
      expect(count).toEqual(42);
      deferred.then(function (value) { count += value; });
      
      expect(count).toEqual(84);
    }
  );
  
  it("can be resolved by an arbitrary asynchronous function", function () {
    var resolved = new WatchedValue(false);
    
    runs(function () {
      deferred.then(resolved.willBe(true));
      setTimeout(deferred.resolve, 1000);
      expect(resolved.value()).toBeFalsy();
    });
    waitsFor(resolved.toBe().truthy(), "deferred to resolve", 2000);
  });
  
  it("can be completed successfully by an asynchronous function", function () {
    var result = new WatchedValue();
    
    runs(function () {
      deferred.then(result.update);
      setTimeout(function () {
        deferred.complete(null, 42);
      }, 1000);
      expect(result.value()).toBeUndefined();
    });
    waitsFor(result.toBe().equalTo(42), "deferred to resolve", 2000);
  });
  
  it("can be completed with an error by an asynchronous function", function () {
    var rejected = new WatchedValue(false);
    
    runs(function () {
      deferred.otherwise(rejected.willBe(true));
      setTimeout(function () {
        deferred.complete(new Error());
      }, 1000);
      expect(rejected.value()).toBeFalsy();
    });
    waitsFor(rejected.toBe().truthy(), "deferred to resolve", 2000);
  });
  
  it("can chain multiple asynchronous calls", function () {
    var resolution = new WatchedValue(0);
    
    runs(function () {
      var postDeferred = deferred.then(function (value) {
        var resolveNext = this.next.resolve;
        
        resolution.update(resolution.value() + value);
        setTimeout(function () { resolveNext(3); }, 1000);
      });
      postDeferred.then(function (value) {
        resolution.update(resolution.value() + value);
      });
      expect(resolution.value()).toEqual(0);
      deferred.resolve(5);
      expect(resolution.value()).toEqual(5);
    });
    waitsFor(resolution.toBe().equalTo(8), "resolution chain to complete", 2000);
  });
  
  it("can resolve multiple chains of asynchronous calls", function () {
    var resolution1 = new WatchedValue(0),
        resolution2 = new WatchedValue(0);
        
    runs(function () {
      var postDeferred = deferred.then(function (value) {
        var resolveNext = this.next.resolve;
        
        resolution1.update(resolution1.value() + value);
        setTimeout(function () { resolveNext(2); }, 1000);
      });
      postDeferred.then(function (value) {
        resolution1.update(resolution1.value() + value);
      });
    });
    runs(function () {
      var postDeferred = deferred.then(function (value) {
        var resolveNext = this.next.resolve;
        
        resolution2.update(resolution2.value() + value);
        setTimeout(function () { resolveNext(3); }, 1000);
      });
      postDeferred.then(function (value) {
        resolution2.update(resolution2.value() + value);
      });
    });
    runs(function () {
      expect(resolution1.value()).toEqual(0);
      expect(resolution2.value()).toEqual(0);
      deferred.resolve(4);
      expect(resolution1.value()).toEqual(4);
      expect(resolution2.value()).toEqual(4);
    });
    waitsFor(resolution1.toBe().equalTo(6), "chain 1 to complete", 2000);
    waitsFor(resolution2.toBe().equalTo(7), "chain 2 to complete", 2000);
  });
  
  it("can manipulate the next deferred in the chain from a callback", function () {
    var resolution;
    
    deferred.then(function (value) {
      this.next.then(function (value) {
        resolution = value + 1;
      });
      this.next.resolve(value + 1);
    });
    deferred.resolve(40);
    
    expect(resolution).toEqual(42);
  });
  
  it("can wait for a specified condition before resolving", function () {
    var resolved = new WatchedValue(false),
        triggered = new WatchedValue(false),
        deferred;
        
    runs(function () {
      deferred = Deferred.waitFor(triggered.toBe().truthy());
      deferred.then(resolved.willBe(true));
      setTimeout(function () { triggered.update(true); }, 1000);
      expect(triggered.value()).toBeFalsy();
      expect(resolved.value()).toBeFalsy();
    });
    waitsFor(resolved.toBe().truthy(), "final resolution", 3000);
    runs(function () {
      expect(triggered.value()).toBeTruthy();
    });
  });
  
  it("can wait for a condition that is already true before resolving", function () {
    var resolved = new WatchedValue(false),
        triggered = new WatchedValue(true),
        deferred;
        
    deferred = Deferred.waitFor(triggered.toBe().truthy());
    expect(resolved.value()).toBeFalsy();
    deferred.then(resolved.willBe(true));
    expect(triggered.value()).toBeTruthy();
    expect(resolved.value()).toBeTruthy();
  });
  
  it("can wait for a specified condition before resolving with a value", function () {
    var resolution = new WatchedValue(0),
        value = new WatchedValue(),
        deferred;
    
    runs(function () {
      deferred = Deferred.waitFor(value.toBe().defined(), value.value);
      deferred.then(function (value) {
        resolution.update(value);
      });
      setTimeout(function () { value.update(42); }, 1000);
      expect(value.value()).toBeUndefined();
      expect(resolution.value()).toEqual(0);
    });
    waitsFor(resolution.toBe().equalTo(42), "final resolution", 2000);
    runs(function () {
      expect(value.value()).toEqual(42);
    });
  });
  
  it("will throw an error if too much time elapses before a condition is satisfied", function () {
    var timedOut = new WatchedValue(false),
        triggered = new WatchedValue(false);
    
    runs(function () {
      deferred = Deferred.waitFor(triggered.toBe().truthy(), 1000);
      deferred.error = timedOut.willBe(true);
    });
    waitsFor(timedOut.toBe().truthy(), "timeout", 2000);
  });
  
  it("will throw an error if too much time elapses before resolution with a value", function () {
    var timedOut = new WatchedValue(false),
        triggered = new WatchedValue(false);
    
    runs(function () {
      deferred = Deferred.waitFor(triggered.toBe().truthy(), function () {
          return 5;
        }, 1000);
      deferred.error = timedOut.willBe(true);
    });
    waitsFor(timedOut.toBe().truthy(), "timeout", 2000);
  });

});

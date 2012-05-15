var DeferredOperation = require('../lib/DeferredOperation');


describe("A DeferredOperation", function () {

  var deferred;
  
  beforeEach(function () {
    deferred = new DeferredOperation();
  });
  
  it("can schedule a callback before being resolved", function () {
    var result;
    
    deferred.then(function () {
      result = arguments;
    });
    expect(result).toBeUndefined();
    
    deferred.resolve(1, 2, 3);
    expect(result).toEqual([ 1, 2, 3 ]);
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
    
    deferred.then(function () { count++; });
    expect(count).toEqual(0);
    
    deferred.resolve();
    expect(count).toEqual(1);
    
    deferred.resolve();
    expect(count).toEqual(1);
  });
  
  it("can schedule multiple callbacks to be resolved", function () {
    var result = [];
    
    deferred.then(function () {
      result.push(1);
    });
    deferred.then(function () {
      result.push(2);
    });
    expect(result.length).toEqual(0);
    
    deferred.resolve();
    expect(result).toEqual([ 1, 2 ]);
  });

});

var DeferredOperation = require('../lib/DeferredOperation');


describe("A DeferredOperation", function () {

  var deferred;
  
  beforeEach(function () {
    deferred = new DeferredOperation();
  });
  
  it("can be resolved after a callback is registered", function () {
    var result;
    
    deferred.then(function () {
      result = true;
    });
    expect(result).toBeUndefined();
    deferred.resolve();
    
    expect(result).toEqual(true);
  });
  
});

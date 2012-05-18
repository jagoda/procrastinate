var Comparable = require('../lib/behaviors/Comparable'),
    Enumerable = require('../lib/behaviors/Enumerable'),
    WatchedValue = require('../lib/WatchedValue'),
    valueOf = WatchedValue.valueOf,
    update = WatchedValue.update;


describe("A WatchedValue", function () {

  var watchedValue;
  
  beforeEach(function () {
    watchedValue = new WatchedValue(42);
  });
  
  it("can have an initial value", function () {
    expect(watchedValue.value()).toEqual(42);
  });
  
  it("can modify its value", function () {
    expect(watchedValue.value(42)).toEqual(42);
    watchedValue.update(false);
    expect(watchedValue.value()).toEqual(false);
  });
  
  it("can be watched for changes to its value", function () {
    var result;
    
    watchedValue.observe(function () {
      result = arguments;
    });
    expect(result).toBeUndefined();
    watchedValue.update();
    expect(result).toEqual([ undefined, 42 ]);
  });
  
  it("can return a Comparable object for comparison operations", function () {
    expect(watchedValue.is()).toBeInstanceOf(Comparable);
    expect(watchedValue.is().equalTo(42)).toBe(true);
    expect(watchedValue.is().not().equalTo(42)).toBe(false);
  });
  
  it("can be updated by a callback", function () {
    function execute (callback) {
      callback('five');
    }
    
    expect(watchedValue.value()).toEqual(42);
    execute(watchedValue.callback());
    expect(watchedValue.value()).toEqual('five');
  });
  
  
  describe("helper", function () {
  
    it("can get the value of a WatchedValue", function () {
      expect(valueOf(watchedValue)).toEqual(42);
    });
    
    it("can update the value of a WatchedValue", function () {
      expect(valueOf(watchedValue)).toEqual(42);
      update(watchedValue).toBe('five');
      expect(valueOf(watchedValue)).toEqual('five');
    });
  
  });

});

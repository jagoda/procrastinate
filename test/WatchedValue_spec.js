var WatchedValue = require('../lib/WatchedValue'),
    make = WatchedValue.make,
    valueOf = WatchedValue.valueOf;


describe("A WatchedValue", function () {

  var watchedValue;
  
  beforeEach(function () {
    watchedValue = new WatchedValue(42);
  });
  
  it("can have an initial value", function () {
    expect(watchedValue == 42).toBeTruthy();
    expect(valueOf(watchedValue)).toEqual(42);
  });
  
  it("can be modified", function () {
    expect(valueOf(watchedValue)).toEqual(42);
    make(watchedValue).equalTo(43);
    expect(valueOf(watchedValue)).toEqual(43);
  });
  
  it("can be watched for changes", function () {
    var result;
    
    watchedValue.observe(function (newValue, oldValue) {
      expect(oldValue).toEqual(42);
      result = newValue;
    });
    expect(valueOf(watchedValue)).toEqual(42);
    
    make(watchedValue).equalTo(43);
    expect(result).toEqual(43);
  });

});

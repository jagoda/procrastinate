var WatchedValue = require('../lib/WatchedValue'),
    make = WatchedValue.make,
    valueOf = WatchedValue.valueOf;


describe("A WatchedValue", function () {

  var watchedValue;
  
  beforeEach(function () {
    watchedValue = new WatchedValue();
  });
  
  it("can have an initial value", function () {
    watchedValue = new WatchedValue(42);
    expect(watchedValue == 42).toBeTruthy();
    expect(valueOf(watchedValue)).toEqual(42);
  });
  
  it("can be assigned a new value", function () {
    expect(valueOf(watchedValue)).toBeUndefined();
    make(watchedValue).equalTo(42);
    expect(valueOf(watchedValue)).toEqual(42);
  });

});

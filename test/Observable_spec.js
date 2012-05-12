var Observable = require('../lib/Observable');


describe("An Observable object", function () {

  var observable;
  
  beforeEach(function () {
    observable = new Observable();
  });

  it("can be watched for notifications", function () {
    var result;
    
    observable.observe(function (value) {
      result = value;
    });
    expect(result).toBeUndefined();
    observable.notify(42);
    
    expect(result).toEqual(42);
  });
  
  it("can be notified with multiple arguments", function () {
    var result;
    
    observable.observe(function (value) {
      result = arguments;
    });
    expect(result).toBeUndefined();
    observable.notify(5, 'five');
    
    expect(result).toEqual([ 5, 'five' ]);
  });

});

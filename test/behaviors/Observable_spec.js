var Observable = require('../../lib/behaviors/Observable');


describe("An Observable object", function () {

  var observable;
  
  beforeEach(function () {
    observable = new Observable();
  });

  it("can be watched for notifications", function () {
    var result1, result2;
    
    observable.observe(function () {
      result1 = arguments;
    });
    observable.observe(function () {
      result2 = 'done';
    });
    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
    
    observable.notify(1, 2, 3);
    expect(result1).toEqual([ 1, 2, 3 ]);
    expect(result2).toEqual('done');
  });
  
  it("can be notified using an array of arguments for observers", function () {
    var result;
    
    observable.observe(function () {
      result = arguments;
    });
    expect(result).toBeUndefined();
    
    observable.notifyWith([ 1, 2, 3 ]);
    expect(result).toEqual([ 1, 2, 3 ]);
  });

});

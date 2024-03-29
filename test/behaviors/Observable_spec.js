var Observable = require('../../lib/behaviors/Observable'),
    when = Observable.when;


describe("An Observable object", function () {

  var observable;
  
  beforeEach(function () {
    observable = new Observable();
  });
  
  it("can be watched for notifications", function () {
    var result;
    
    observable.observe(function () {
      result = arguments;
    });
    expect(result).toBeUndefined();
    
    observable.notify(42, 'forty-two');
    expect(result).toEqual([ 42, 'forty-two' ]);
  });
  
  it("can be notified with an array of arguments to apply to observers", function () {
    var result;
    
    observable.observe(function () {
      result = arguments;
    });
    expect(result).toBeUndefined();
    
    observable.notifyWith([ 1, 2, 3 ]);
    expect(result).toEqual([ 1, 2, 3 ]);
  });
  
  describe("using natural language", function () {
    
    it("can watch for notifications from an observable object", function () {
      var result;
      
      when(observable).isNotifiedThen(function () {
        result = arguments;
      });
      expect(result).toBeUndefined();
      
      observable.notify(1, 2, 3);
      expect(result).toEqual([ 1, 2, 3 ]);
    });
    
  });

});

var DeferredOperation = require('../lib/DeferredOperation'),
    ExecutionQueue = require('../lib/ExecutionQueue');


describe("An ExecutionQueue", function () {
  
  var queue;
  
  beforeEach(function () {
    queue = new ExecutionQueue();
  });
  
  it("can execute a function", function () {
    var result;
    
    expect(result).toBeUndefined();
    queue.run(function () {
      result = true;
    });
    expect(result).toBe(true);
  });
  
  it("can execute asynchronous jobs in any order", function () {
    var result = [];
    
    function task1 (next) {
      setTimeout(function () { result.push(1); next(); }, 300);
    }
    
    function task2 (next) {
      setTimeout(function () { result.push(2); next(); }, 100);
    }
    
    function task3 (next) {
      setTimeout(function () { result.push(3); next(); }, 200);
    }
    
    runs(function () {
      queue.run(task1).run(task2).run(task3);
      expect(result.length).toEqual(0);
    });
    waitsFor(function () { return result.length == 3; });
    runs(function () {
      expect(result).toEqual([ 2, 3, 1 ]);
    });
  });
  
  it("can execute synchronous jobs in the order registered", function () {
    var result = [];
    
    function task1 (next) {
      setTimeout(function () { result.push(1); next(); }, 300);
    }
    
    function task2 (next) {
      setTimeout(function () { result.push(2); next(); }, 100);
    }
    
    function task3 (next) {
      setTimeout(function () { result.push(3); next(); }, 200);
    }
    
    runs(function () {
      queue.run(task1, true).run(task2, true).run(task3, true);
      expect(result.length).toEqual(0);
    });
    waitsFor(function () { return result.length == 3; });
    runs(function () {
      expect(result).toEqual([ 1, 2, 3 ]);
    });
  });
  
  it("can interleave synchronous and asynchronous jobs", function () {
    var result = [];
    
    function task1 (next) {
      setTimeout(function () { result.push(1); next(); }, 200);
    }
    
    function task2 (next) {
      setTimeout(function () { result.push(2); next(); }, 100);
    }
    
    function task3 (next) {
      setTimeout(function () { result.push(3); next(); }, 200);
    }
    
    function task4 (next) {
      setTimeout(function () { result.push(4); next(); }, 100);
    }
    
    runs(function () {
      queue.run(task1).run(task2).run(task3, true).run(task4);
      expect(result.length).toEqual(0);
    });
    waitsFor(function () { return result.length == 4; });
    runs(function () {
      expect(result).toEqual([ 2, 1, 3, 4 ]);
    });
  });
  
  it("provides a handler to tasks that can deal with errors", function () {
    var error = new Error("handled"),
        result;
        
    function task1 (next, handler) {
      handler(null);
    }
    
    function task2 (next, handler) {
      handler(error);
    }
    
    expect(function () {
      queue.run(task1, true).run(task2, true);
    }).toThrow(error);
  });
  
  it("can pass arguments between tasks", function () {
    var finished;
    
    function task1 (next) {
      next(5);
    }
    
    function task2 (value, next) {
      expect(value).toEqual(5);
      next();
    }
    
    function task3 (next) {
      finished = true;
    }
    
    expect(finished).toBeUndefined();
    queue.run(task1, true).run(task2, true).run(task3, true);
    expect(finished).toBe(true);
  });

});

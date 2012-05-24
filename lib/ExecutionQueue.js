var DeferredOperation = require('./DeferredOperation');


function ExecutionQueue () {
  this._next = new DeferredOperation();
  this._inFlight = 0;
  this._synchronousTasks = [];
  
  this._next.resolve();
}

ExecutionQueue.prototype.run = function run (task, synchronous) {
  var queue = this,
      next = this._next,
      check, deferred;

  if (synchronous) {
    deferred = new DeferredOperation();
    this._synchronousTasks.push(deferred);
    this._next = this._executeTask(deferred, task, synchronous);
    this._next.otherwise(function (error) { throw error; });
    next.then(function () {
      queue._checkQueue.apply(queue, arguments);
    });
  }
  else {
    deferred = this._executeTask(next, task, synchronous);
    deferred.then(function () {
      queue._inFlight--;
      queue._checkQueue.apply(queue, arguments);
    });
    deferred.otherwise(function (error) { throw error; });
  }
  
  return this;
};

ExecutionQueue.prototype._checkQueue  = function () {
  var next;
  
  if (this._inFlight == 0) {
    if (next = this._synchronousTasks.shift()) {
      next.resolve.apply(next, arguments);
    }
  }
};

ExecutionQueue.prototype._executeTask = function (next, task, synchronous) {
  var queue = this;
  
  return next.then(function () {
    var parameters = Array.prototype.slice.call(arguments);
    
    if (!synchronous) {
      queue._inFlight++;
    }
    
    parameters.push(this.callback(), this.handler());
    task.apply(queue, parameters);
  });
};


module.exports = ExecutionQueue;

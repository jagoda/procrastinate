var DeferredOperation = require('./DeferredOperation');


function ExecutionQueue () {
  var next = this._next = new DeferredOperation();
  
  next.resolve();
}

ExecutionQueue.prototype.run = function run (task, synchronous) {
  var next = this._next,
      deferred = next.then(function () {
        task(this.callback(), this.handler());
      });
      
  deferred.otherwise(function (error) { throw error; });
  
  if (synchronous) {
    this._next = deferred;
  }
  
  return this;
};


module.exports = ExecutionQueue;

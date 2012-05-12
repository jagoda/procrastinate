var Observable = require('./Observable');


function DeferredOperation () {
  this._resolved = new Observable();
}

DeferredOperation.prototype.resolve = function () {
  this._resolved.notify();
};

DeferredOperation.prototype.then = function (callback) {
  this._resolved.observe(callback);
  
  return this;
};


module.exports = DeferredOperation;

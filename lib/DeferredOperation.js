var Observable = require('./behaviors/Observable');


var STATE = {
  UNRESOLVED: 0,
  RESOLVED: 1
};


function DeferredOperation () {
  this._resolution = undefined;
  this._resolver = new Observable();
  this._state = STATE.UNRESOLVED;
}

DeferredOperation.prototype.resolve = function () {
  var resolver = this._resolver;
  
  if (this._state == STATE.UNRESOLVED) {
    this._resolution = arguments;
    this._state = STATE.RESOLVED;
    resolver.notifyWith(arguments);
  }
  
  return this;
};

DeferredOperation.prototype.then = function (callback) {
  var resolution = this._resolution,
      resolver = this._resolver,
      state = this._state;
  
  switch(state) {
    case STATE.UNRESOLVED:
      resolver.observe(callback);
      break;
    case STATE.RESOLVED:
      if (typeof callback === 'function') {
        callback.apply(this, resolution);
      }
      break;
    default:
      break;
  };
  
  return this;
};


module.exports = DeferredOperation;

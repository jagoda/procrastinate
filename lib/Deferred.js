var utilities = require('./utilities');


var STATE = {
  'new': 0,
  'resolved': 1,
  'rejected': 2
};


function Deferred () {
  this._callbacks = [];
  this._state = STATE.new;
  
  this.resolve = utilities.bind(Deferred.prototype.resolve, this);
}

Deferred.prototype.error = function (error) {
  throw error;
};

Deferred.prototype.reject = function (error) {
  if (this._state === STATE.new) {
    if (! (error instanceof Error)) {
      error = this._resolution = new Error(error);
    }
    
    this._state = STATE.rejected;
    this.error(error);
  }
  
  return this;
};

Deferred.prototype.resolve = function () {
  var index;
  
  if (this._state === STATE.new) {
    this._resolution = Array.prototype.slice.call(arguments);
    
    for (index = 0; index < this._callbacks.length; index++) {
      this._callbacks[index].apply(this, this._resolution);
    }
    
    this._state = STATE.resolved;
  }
  
  return this;
};

Deferred.prototype.then = function (callback) {
  var deferred = new Deferred(),
      callback = utilities.bind(callback, { resolveNext: deferred.resolve });
  
  if (this._state === STATE.resolved) {
    callback.apply(this, this._resolution);
  }
  else if (this._state === STATE.new) {
    this._callbacks.push(callback);
  }
  else {
    this.error(this._resolution);
  }
  
  return deferred;
};


Deferred.waitFor = function (conditionFunction, resolutionFunction, duration) {
  var deferred = new Deferred(),
      resolutionFunction = resolutionFunction || function () {},
      time = (new Date()).getTime();
      
  if (typeof resolutionFunction === 'number' && arguments.length == 2) {
    duration = resolutionFunction;
    resolutionFunction = function () {};
  }
  
  (function checkValue () {
    if (conditionFunction()) {
      deferred.resolve(resolutionFunction());
    }
    else {
      if (duration && (((new Date()).getTime() - time) >= duration)) {
        deferred.reject("Timed out");
      }
      else {
        setTimeout(checkValue, 100);
      }
    }
  })();
  
  return deferred;
};


module.exports = Deferred;

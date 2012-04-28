var utilities = require('./utilities');


var STATE = {
  'new': 0,
  'resolved': 1,
  'rejected': 2
};


function Deferred () {
  this._callbacks = [];
  this._state = STATE.new;
  
  this.complete = utilities.bind(Deferred.prototype.complete, this);
  this.reject = utilities.bind(Deferred.prototype.reject, this);
  this.resolve = utilities.bind(Deferred.prototype.resolve, this);
}

Deferred.prototype.complete = function (error, result) {
  if (error) {
    this.reject(error);
  }
  else {
    this.resolve(result);
  }
  
  return this;
};

Deferred.prototype.error = function (error) {
  throw error;
};

Deferred.prototype.otherwise = function (errback) {
  this.error = errback;
  
  return this;
};

Deferred.prototype.reject = function (error) {
  if (this._state === STATE.new) {
    if (! (error instanceof Error)) {
      error = new Error(error);
    }
    
    this._resolution = error;
    this._state = STATE.rejected;
    this.error(error);
  }
  
  return this;
};

Deferred.prototype.resolve = function () {
  var index;
  
  if (this._state === STATE.new) {
    this._resolution = Array.prototype.slice.call(arguments);
    this._state = STATE.resolved;
    
    for (index = 0; index < this._callbacks.length; index++) {
      this._callbacks[index].apply(this, this._resolution);
    }
  }
  
  return this;
};

Deferred.prototype.then = function (callback) {
  var deferred = new Deferred(),
      callback = utilities.bind(callback, { next: deferred });
  
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


Deferred.after = function () {
  var deferreds = Array.prototype.slice.call(arguments),
      finalDeferred = new Deferred(),
      resolutions = [],
      resolved = 0;
      
  deferreds.forEach(function (deferred, index) {
    deferred.then(function (result) {
      resolutions[index] = result;
      
      if (++resolved == deferreds.length) {
        finalDeferred.resolve(resolutions);
      }
    });
    deferred.otherwise(function (error) {
      finalDeferred.reject(error);
    });
  });
  
  return finalDeferred;
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

var utilities = require('./utilities');


function Deferred () {
  this._callbacks = [];
  this._resolved = false;
  
  this.resolve = utilities.bind(Deferred.prototype.resolve, this);
}

Deferred.prototype.resolve = function () {
  var index;
  
  if (this._resolved === false) {
    this._resolution = Array.prototype.slice.call(arguments);
    
    for (index = 0; index < this._callbacks.length; index++) {
      this._callbacks[index].apply(this, this._resolution);
    }
    
    this._resolved = true;
  }
  
  return this;
};

Deferred.prototype.then = function (callback) {
  var deferred = new Deferred(),
      callback = utilities.bind(callback, { resolveNext: deferred.resolve });
  
  if (this._resolved === true) {
    callback.apply(this, this._resolution);
  }
  else {
    this._callbacks.push(callback);
  }
  
  return deferred;
};


Deferred.waitFor = function (conditionFunction, resolutionFunction) {
  var deferred = new Deferred(),
      resolutionFunction = resolutionFunction || function () {};
  
  (function checkValue () {
    if (conditionFunction()) {
      deferred.resolve(resolutionFunction());
    }
    else {
      setTimeout(checkValue, 100);
    }
  })();
  
  return deferred;
};


module.exports = Deferred;

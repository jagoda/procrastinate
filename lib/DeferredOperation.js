var Bindable = require('./behaviors/Bindable'),
    Comparable = require('./behaviors/Comparable'),
    Enumerable = require('./behaviors/Enumerable'),
    Observable = require('./behaviors/Observable');


var STATE = {
  UNRESOLVED: 0,
  RESOLVED: 1,
  REJECTED: 2
};


function DeferredOperation () {
  this._rejection = undefined;
  this._rejector = new Observable();
  this._resolution = undefined;
  this._resolver = new Observable();
  this._state = STATE.UNRESOLVED;
}

DeferredOperation.prototype = new Bindable();

DeferredOperation.prototype.callback = function () {
  return this.bind('resolve');
};

DeferredOperation.prototype.errback = function () {
  return this.bind('reject');
};

DeferredOperation.prototype.handler = function () {
  var callback = this.callback(),
      errback = this.errback();
      
  return function (error) {
    var parameters = Array.prototype.slice.call(arguments, 1);
    
    if (error) {
      errback(error);
    }
    else {
      callback.apply(this, parameters);
    }
  };
};

DeferredOperation.prototype.otherwise = function (callback) {
  var rejector = this._rejector,
      state = this._state;
  
  if (typeof callback === 'function') {
    if (state == STATE.REJECTED) {
      callback.call(this, this._rejection);
    }
    else if (state == STATE.UNRESOLVED) {
      rejector.observe(callback);
    }
  }

  return this;
};

DeferredOperation.prototype.reject = function (reason) {
  var rejector = this._rejector;
  
  if (this._state == STATE.UNRESOLVED) {
    this._state = STATE.REJECTED;
    this._rejection = reason instanceof Error ? reason : new Error(reason);
    
    rejector.notify(this._rejection);
  }
  
  return this;
};

DeferredOperation.prototype.resolve = function () {
  var resolver = this._resolver;
  
  if (this._state == STATE.UNRESOLVED) {
    this._state = STATE.RESOLVED;
    this._resolution = arguments;
    
    resolver.notifyWith(arguments);
  }

  return this;
};

DeferredOperation.prototype.then = function (callback) {
  var next = new DeferredOperation(),
      resolution = this._resolution,
      resolver = this._resolver,
      state = this._state;
  
  if (typeof callback === 'function') {
    if (state == STATE.RESOLVED) {
      callback.apply(next, resolution);
    }
    else if (state == STATE.UNRESOLVED) {
      resolver.observe(function () {
        callback.apply(next, arguments);
      });
    }
  }
  
  return next;
};


DeferredOperation.when = function (watchedValue) {
  return new WatchedValueObserver(watchedValue);
};


function WatchedValueObserver (watchedValue) {
  this._watchedValue = watchedValue;
}

WatchedValueObserver.prototype.is = function () {
  var watchedValue = this._watchedValue,
      proxy = this._watchForCondition(function () {
        return watchedValue.is();
      });
      
  proxy.not = WatchedValueObserver.prototype.isNot;
  
  return proxy;
};

WatchedValueObserver.prototype.isNot = function () {
  var watchedValue = this._watchedValue,
      proxy = this._watchForCondition(function () {
        return watchedValue.is().not();
      });
      
  proxy.not = WatchedValueObserver.prototype.is;
  
  return proxy;
};

WatchedValueObserver.prototype._watchForCondition = function (getComparable) {
  var watchedValue = this._watchedValue,
      methods = new Enumerable(Comparable.prototype),
      proxy = Object.create(this);
      
  methods.forEach(function (name, implementation) {
    if (name != 'not') {
      proxy[name] = function () {
        var deferred = new DeferredOperation(),
            parameters = arguments;
        
        watchedValue.observe(function () {
          var comparable = getComparable();
          
          if (comparable[name].apply(comparable, parameters)) {
            deferred.resolve(this);
          }
        });
        
        return deferred;
      };
    }
  });
  
  return proxy;
};


module.exports = DeferredOperation;

var Bindable = require('./behaviors/Bindable'),
    Comparable = require('./behaviors/Comparable'),
    forEach = require('./behaviors/Enumerable').forEach,
    Observable = require('./behaviors/Observable'),
    WatchedValue = require('./WatchedValue');


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

Object.defineProperties(DeferredOperation.prototype, {

  callback: {
    configurable: true,
    enumerable: true,
    
    get: function () { return this.bind('resolve'); }
  },
  
  errback: {
    configurable: true,
    enumerable: true,
    
    get: function () { return this.bind('reject'); }
  },
  
  handler: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      var callback = this.callback,
          errback = this.errback;
          
      return function (error) {
        var parameters = Array.prototype.slice.call(arguments, 1);
        
        if (error) {
          errback(error);
        }
        else {
          callback.apply(this, parameters);
        }
      };
    }
  }

});

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


DeferredOperation.when = function (object) {
  if (object instanceof WatchedValue) {
    return new WatchedValueObserver(object);
  }
  else if (object instanceof Observable) {
    return new Observer(object);
  }
};


function Observer (object) {
  this._value = object;
}

Object.defineProperties(Observer.prototype, {

  isNotified: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      var deferred = new DeferredOperation(),
          observable = this._value;
          
      observable.observe(deferred.callback);
      
      return deferred;
    }
  }
  
});


function WatchedValueObserver (watchedValue) {
  Observer.call(this, watchedValue);
}

WatchedValueObserver.prototype = new Observer();

Object.defineProperties(WatchedValueObserver.prototype, {
  
  is: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      var watchedValue = this._value,
          proxy = this._watchForCondition(function () {
            return watchedValue.is;
          });
          
      Object.defineProperty(proxy, 'not',
        Object.getOwnPropertyDescriptor(WatchedValueObserver.prototype, 'isNot')
      );
      
      return proxy;
    }
  },
  
  isNot: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      var watchedValue = this._value,
          proxy = this._watchForCondition(function () {
            return watchedValue.is.not;
          });
          
      Object.defineProperty(proxy, 'not',
        Object.getOwnPropertyDescriptor(WatchedValueObserver.prototype, 'is')
      );
      
      return proxy;
    }
  }
  
});

WatchedValueObserver.prototype._watchForCondition = function (getComparable) {
  var watchedValue = this._value,
      proxy = Object.create(this);

  forEach('property').on(Comparable.prototype).do(function (name, descriptor) {
    var newDescriptor;
    
    function wrapComparison () {
      var comparable = getComparable(),
          comparableDescriptor = getPropertyDescriptor(comparable, name),
          deferred = new DeferredOperation(),
          implementation = comparableDescriptor.value || comparableDescriptor.get,
          parameters = arguments;
          
      if (implementation.apply(comparable, parameters)) {
        deferred.resolve(watchedValue);
      }
      else{
        watchedValue.observe(function () {
          var comparable = getComparable();
          
          if (implementation.apply(comparable, parameters)) {
            deferred.resolve(this);
          }
        });
      }
      
      return deferred;
    }
    
    if (name != 'not') {
      newDescriptor = {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable
      };
      
      if (descriptor.value) {
        newDescriptor.value = wrapComparison;
      }
      else {
        newDescriptor.get = wrapComparison;
      }
      
      Object.defineProperty(proxy, name, newDescriptor);
    }
  });
  
  return proxy;
};


function getPropertyDescriptor (object, name) {
  var descriptor;
  
  for (; ! descriptor; object = Object.getPrototypeOf(object) ) {
    descriptor = Object.getOwnPropertyDescriptor(object, name);
  }
  
  return descriptor;
}


module.exports = DeferredOperation;

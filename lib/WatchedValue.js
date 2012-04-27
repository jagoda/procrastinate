var Deferred = require('./Deferred'),
    Iterator = require('./Iterator'),
    utilities = require('../lib/utilities');


function WatchedValue (initialValue) {
  this._value = initialValue;
  
  this.update = utilities.bind(WatchedValue.prototype.update, this);
  this.value = utilities.bind(WatchedValue.prototype.value, this);
}


var ComparableInjector = new Iterator({

  defined: function () {
    return typeof this.value() !== 'undefined';
  },
  
  equalTo: function (expected) {
    return this.value() == expected;
  },
  
  falsy: function () {
    return ! this.value();
  },
  
  truthy: function () {
    return !! this.value();
  }

});


WatchedValue.prototype.is = function () {
  var comparable = ComparableInjector.copy(this);
  
  comparable.not = WatchedValue.prototype.isNot;
  
  return comparable;
};

WatchedValue.prototype.isNot = function () {
  var comparable = ComparableInjector.map(function (callback, implementation) {
          return function () {
            return ! implementation.apply(this, arguments);
          };
        }, this);
  
  comparable.not = WatchedValue.prototype.is;
  
  return comparable;
};

WatchedValue.prototype.toBe = function () {
  var comparable = ComparableInjector.map(function (callback, implementation) {
          return function () {
            return utilities.attach(implementation, this,
              Array.prototype.slice.call(arguments));
          };
        }, this);
  
  comparable.not = WatchedValue.prototype.toNotBe;
  
  return comparable;
};

WatchedValue.prototype.toNotBe = function () {
  var comparable = ComparableInjector.map(function (callback, implementation) {
          return function () {
            return utilities.attach(function () {
                return ! implementation.apply(this, arguments);
              },
              this,
              Array.prototype.slice.call(arguments)
            );
          };
        }, this);
  
  comparable.not = WatchedValue.prototype.toBe;
  
  return comparable;
};

WatchedValue.prototype.update = function (value) {
  this._value = value;
  return this;
};

WatchedValue.prototype.value = function () {
  return this._value;
};

WatchedValue.prototype.willBe = function (futureValue) {
  return utilities.bind(WatchedValue.prototype.update, this, futureValue);
};


function WatchedWrapper (watchedValue) {
  this._watchedValue = watchedValue;
}

WatchedWrapper.prototype.is = function () {
  var watchedValue = this._watchedValue,
      comparable = ComparableInjector.map(function (callback, implementation) {
        return function () {
          var comparison = utilities.attach(implementation, this,
                Array.prototype.slice.call(arguments)),
              deferred = new Deferred(),
              update = watchedValue.update;
              
          if (comparison()) {
            deferred.resolve(watchedValue.value());
          }
          else {
            watchedValue.update = function () {
              var result = update.apply(watchedValue, arguments);
              
              if (comparison()) {
                deferred.resolve(watchedValue.value());
              }
              
              return result;
            };
          }
              
          return deferred;
        };
      }, watchedValue);
      
  comparable.not = utilities.bind(WatchedWrapper.prototype.isNot, this);
  
  return comparable;
};

WatchedWrapper.prototype.isNot = function () {
  var watchedValue = this._watchedValue,
      comparable = ComparableInjector.map(function (callback, implementation) {
        return function () {
          var comparison = utilities.attach(implementation, this,
                Array.prototype.slice.call(arguments)),
              deferred = new Deferred(),
              update = watchedValue.update;
              
          if (! comparison()) {
            deferred.resolve(watchedValue.value());
          }
          else {
            watchedValue.update = function () {
              var result = update.apply(watchedValue, arguments);
              
              if (! comparison()) {
                deferred.resolve(watchedValue.value());
              }
              
              return result;
            };
          }
              
          return deferred;
        };
      }, watchedValue);
      
  comparable.not = utilities.bind(WatchedWrapper.prototype.is, this);
  
  return comparable;
};

WatchedValue.when = function (watchedValue) {
  return new WatchedWrapper(watchedValue);
};


module.exports = WatchedValue;

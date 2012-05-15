var Observable = require('./behaviors/Observable');


function WatchedValue (initialValue) {
  this._value = initialValue;
}

WatchedValue.prototype = new Observable();

WatchedValue.prototype.valueOf = function () {
  return this._value;
};


function WatchedValueModifier (watchedValue) {
  this._watchedValue = watchedValue;
}

WatchedValueModifier.prototype.equalTo = function (newValue) {
  var watchedValue = this._watchedValue,
      oldValue = watchedValue._value;
  
  watchedValue._value = newValue;
  watchedValue.notify(newValue, oldValue);
  
  return this;
};


WatchedValue.make = function (watchedValue) {
  return new WatchedValueModifier(watchedValue);
};

WatchedValue.valueOf = function (watchedValue) {
  return watchedValue.valueOf();
};


module.exports = WatchedValue;

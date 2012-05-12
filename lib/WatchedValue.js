function WatchedValue (initialValue) {
  this._value = initialValue;
}

WatchedValue.prototype.valueOf = function () {
  return this._value;
};


function WatchedValueModifier (watchedValue) {
  if (! (watchedValue instanceof WatchedValue)) {
    throw new Error("Argument must be a WatchedValue.");
  }
  
  this._watchedValue = watchedValue;
}

WatchedValueModifier.prototype.equalTo = function (value) {
  this._watchedValue._value = value;
};


WatchedValue.make = function (watchedValue) {
  return new WatchedValueModifier(watchedValue);
};

WatchedValue.valueOf = function (watchedValue) {
  return watchedValue.valueOf();
};


module.exports = WatchedValue;

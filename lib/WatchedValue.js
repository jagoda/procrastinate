var Bindable = require('./behaviors/Bindable'),
    Comparable = require('./behaviors/Comparable'),
    Mixable = require('./behaviors/Mixable'),
    Observable = require('./behaviors/Observable');


function WatchedValue (value) {
  this._value = value;
}

WatchedValue.prototype = new Mixable();
WatchedValue.prototype.mixin(Bindable);
WatchedValue.prototype.mixin(Observable);

WatchedValue.prototype.callback = function () {
  return this.bind('update');
};

WatchedValue.prototype.handler = function () {
  var self = this;
  
  return function (error, value) {
    if (error) { throw error; }
    
    self.update(value);
  };
};

WatchedValue.prototype.is = function () {
  return new Comparable(this._value);
};

WatchedValue.prototype.update = function (value) {
  var oldValue = this._value;
  
  this._value = value;
  this.notify(value, oldValue);
  
  return this;
};

WatchedValue.prototype.value = function () {
  return this._value;
};


WatchedValue.valueOf = function (watchedValue) {
  return watchedValue.value();
};

WatchedValue.update = function (watchedValue) {
  return new WatchedValueModifier(watchedValue);
};


function WatchedValueModifier (watchedValue) {
  this._watchedValue = watchedValue;
}

WatchedValueModifier.prototype.toBe = function (value) {
  this._watchedValue.update(value);
};


module.exports = WatchedValue;

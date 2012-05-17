var Comparable = require('./behaviors/Comparable'),
    Observable = require('./behaviors/Observable');


function WatchedValue (value) {
  this._value = value;
}

WatchedValue.prototype = new Observable();

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


module.exports = WatchedValue;

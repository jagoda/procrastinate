var Bindable = require('./behaviors/Bindable'),
    Comparable = require('./behaviors/Comparable'),
    inject = require('./behaviors/Mixable').inject,
    Observable = require('./behaviors/Observable');


function WatchedValue (value) {
  this._value = value;
}

inject(WatchedValue.prototype).with(Bindable);
inject(WatchedValue.prototype).with(Observable);

Object.defineProperties(WatchedValue.prototype, {

  callback: {
    configurable: true,
    enumerable: true,
    
    get: function () { return this.bind('update'); }
  },
  
  handler: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      var self = this;
  
      return function (error, value) {
        if (error) { throw error; }
        
        self.update(value);
      };
    }
  },
  
  is: {
    configurable: true,
    enumerable: true,
    
    get: function () { return new Comparable(this._value); }
  },

  value: {
    configurable: true,
    enumerable: true,
    
    get: function () { return this._value; },
    
    set: function (value) {
      this.update(value);
    }
  }
  
});


WatchedValue.prototype.update = function (value) {
  var oldValue = this._value;
  
  this._value = value;
  this.notify(value, oldValue);
  
  return this;
};


WatchedValue.valueOf = function (watchedValue) {
  return watchedValue.value;
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

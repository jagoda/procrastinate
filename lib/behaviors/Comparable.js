var forEach = require('./Enumerable').forEach;


function Comparable (value) {
  this._value = arguments.length > 0 ? value : this;
}

Object.defineProperties(Comparable.prototype, {
  
  defined: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      return typeof this._value !== 'undefined';
    }
  },
  
  equalTo: {
    configurable: true,
    enumerable: true,
    
    value: function (expected) {
      return this._value == expected;
    }
  },
  
  falsy: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      return ! this._value;
    }
  },
  
  not: {
    cofigurable: true,
    enumerable: true,
    
    get: function () {
      var inverse = Object.create(this),
          self = this;
          
      forEach('property').on(Comparable.prototype).do(function (name, descriptor) {
        var implementation;
        
        if (name == 'not') {
          descriptor.get = function () { return self; };
        }
        else if (descriptor.value) {
          implementation = descriptor.value;
          descriptor.value = function () {
            return ! implementation.apply(this, arguments);
          };
        }
        else {
          implementation = descriptor.get;
          descriptor.get = function () {
            return ! implementation.apply(this, arguments);
          };
        }
          
        Object.defineProperty(inverse, name, descriptor);
      });
    
      return inverse;
    }
  },
  
  truthy: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      return !! this._value;
    }
  },
  
  undefined: {
    configurable: true,
    enumerable: true,
    
    get: function () {
      return typeof this._value === 'undefined';
    }
  },
  
});


Comparable.valueOf = function (value) {
  return new Comparator(value);
};


function Comparator (value) {
  this._value = value;
}

Object.defineProperty(Comparator.prototype, 'is', {
  configurable: true,
  enumerable: true,
  
  get: function () {
    return new Comparable(this._value);
  }
});


module.exports = Comparable;

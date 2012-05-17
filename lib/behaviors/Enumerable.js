function Enumerable (object) {
  this._value = object instanceof Object ? object : this;
}

Enumerable.prototype.forEach = function (callback) {
  var object = this._value,
      key;
      
  if (typeof callback === 'function') {
    for (key in object) {
      callback.call(object, key, object[key]);
    }
  }
  
  return this;
};


module.exports = Enumerable;

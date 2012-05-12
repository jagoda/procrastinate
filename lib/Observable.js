function Observable () {
  this._observers = [];
}

Observable.prototype.notify = function () {
  var observers = this._observers,
      i;
      
  for (i = 0; i < observers.length; i++) {
    observers[i].apply(this, arguments);
  }
  
  return this;
};

Observable.prototype.observe = function (callback) {
  var observers = this._observers;
  
  if (typeof callback === 'function') {
    observers.push(callback);
  }
  
  return this;
};


module.exports = Observable;

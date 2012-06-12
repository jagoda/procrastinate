function Observable () {
  this._observers = [];
}

Observable.prototype.notify = function () {
  return Observable.prototype.notifyWith.call(this, arguments);
};

Observable.prototype.notifyWith = function (parameters) {
  var observers = this._observers,
    self = this;
      
  observers.forEach(function (callback) {
    callback.apply(self, parameters);
  });
  
  return this;
};

Observable.prototype.observe = function (callback) {
  var observers = this._observers;
  
  if (typeof callback === 'function') {
    observers.push(callback);
  }
  
  return this;
};


Observable.when = function (observable) {
  return new Observer(observable);
};


function Observer (observable) {
  this._observable = observable;
}

Observer.prototype.isNotifiedThen = function (callback) {
  var observable = this._observable;
  
  observable.observe(callback);
  
  return this;
};


module.exports = Observable;

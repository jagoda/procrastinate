function Iterator (subject) {
  this._subject = subject;
}

Iterator.copy = function (subject, parent) {
  return Iterator.mixin(Object.create(parent || Object.prototype), subject);
};

Iterator.filter = function (subject, callback, parent) {
  var filteredObject = Object.create(parent || Object.prototype);
  
  Iterator.forEach(subject, function (key, value) {
    if (callback.call(subject, key, value)) {
      filteredObject[key] = value;
    }
  });
  
  return filteredObject;
};

Iterator.forEach = function (subject, callback) {
  var key;
  
  for (key in subject) {
    callback.call(subject, key, subject[key]);
  }
  
  return this;
};

Iterator.map = function (subject, callback, parent) {
  var object = Object.create(parent || Object.prototype);
  
  Iterator.forEach(subject, function (key, value) {
    object[key] = callback.call(subject, key, value);
  });
  
  return object;
};

Iterator.mixin = function (subject) {
  var sources = Array.prototype.slice.call(arguments, 1);
  
  sources.forEach(function (source) {
    Iterator.forEach(source, function (key, value) {
      subject[key] = value;
    });
  });
  
  return subject;
};

Iterator.prototype.copy = function (parent) {
  return Iterator.copy(this._subject, parent);
};

Iterator.prototype.filter = function (callback, parent) {
  return Iterator.filter(this._subject, callback, parent);
};

Iterator.prototype.forEach = function (callback) {
  return Iterator.forEach(this._subject, callback);
};

Iterator.prototype.map = function (callback, parent) {
  return Iterator.map(this._subject, callback, parent);
};

Iterator.prototype.inject = function (target) {
  return Iterator.mixin(target, this._subject);
};


module.exports = Iterator;

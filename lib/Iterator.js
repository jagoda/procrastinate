function Iterator (subject) {
  this._subject = subject;
}

Iterator.copy = function (subject, parent) {
  return Iterator.map(subject, function (key, value) {
      return value;
    },
    parent
  );
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

Iterator.prototype.copy = function (parent) {
  return Iterator.copy(this._subject, parent);
};

Iterator.prototype.forEach = function (callback) {
  return Iterator.forEach(this._subject, callback);
};

Iterator.prototype.map = function (callback, parent) {
  return Iterator.map(this._subject, callback, parent);
};

module.exports = Iterator;

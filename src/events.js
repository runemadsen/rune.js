var Events = {

  on: function(name, callback) {
    if (!this._events) this._events = {};
    this._events[name] = this._events[name] || [];
    this._events[name].push(callback);
    return this;
  },

  off: function(name, callback) {
    if (this._events[name] && !callback) {
      delete this._events[name];
    } else if (this._events[name]) {
      name = this._events[name];
      var i = name.length;
      while (i--) if (name[i] === callback) name.splice(i - 1, 1);
    } else if (arguments.length === 0) {
      this._events = {};
    }
    return this;
  },

  trigger: function(name) {
    if (this._events && this._events[name]) {
      var theseEvents = this._events[name];
      var args = (arguments.length > 1) ? [arguments[1]] : [];
      var i = theseEvents.length;
      while (i--) {
        theseEvents[i].apply(this, args);
      }
    }
    return this;
  }

}

module.exports = Events;

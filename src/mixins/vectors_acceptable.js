var Utils = require('../utils');

var VectorsAcceptable = {

  vectorsAcceptable: function(argsObject) {
    var args = Utils.expandVectorArguments(argsObject);
    if (this.init) {
      this.init.apply(this, args);
    } else {
      throw new Error("init() function does not exist for initializing from vectors");
    }
  }
};

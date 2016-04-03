var Rune = require("../tmp/rune.node.js");

module.exports = function() {

  var start = new Date().getTime();

  var r = new Rune({
    width: 600,
    height: 400
  });

  for(var i = 0; i < 10000; i++) {
    var col = new Rune.Color(255, 0, 0);
    r.rect(0, 0, 100, 100).fill(col).stroke(255);
  }

  for(var i = 0; i < 60; i++) {
    r.draw();
  }

  var end = new Date().getTime();
  var time = end - start;
  console.log('Execution time: ' + time + 'ms');
}

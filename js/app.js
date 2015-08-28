$(function() {
  createMenu();
});

function createMenu() {

  var ul = $("<ul></ul>")

  _.each($("h2"), function(h2) {
    var jh2 = $(h2);
    ul.append("<li><a href=\"#" + jh2.attr('id') + "\">" + jh2.text() + "</a></li>")
  });

  ul.append("<li><a href=\"https://twitter.com/runemadsen\">Follow @runemadsen for updates</a></li>")

  $("header").append(ul);
}
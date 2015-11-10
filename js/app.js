$(function() {

  // if the page has a #toc div, generate a toc list
  // in that div.
  var toc = $("#toc");
  if(toc.length > 0) {

    toc.append("<ul id='top'></ul>");

    var curLi;

    $("h2, h3").each(function() {

      var jheading = $(this);
      var slug = jheading.attr("id");
      var txt = jheading.text();

      if(this.tagName == 'H2') {
        curLi = $("<li><a href='#"+slug+"'>"+txt+"</a><ul></ul></li>");
        $("#toc ul#top").append(curLi);
      } else {
        curLi.find('ul').append("<li><a href='#"+slug+"'>"+txt+"</a></li>");
      }

    });
  }

});

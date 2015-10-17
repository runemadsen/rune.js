$(function() {

  // if the page has a #toc div, generate a toc list
  // in that div.
  var toc = $("#toc");
  if(toc.length > 0) {
    toc.append("<ul></ul>");
    $("h2").each(function() {
      var jheading = $(this);
      var slug = jheading.attr("id");
      var txt = jheading.text();
      $("#toc ul").append("<li><a href='#"+slug+"'>"+txt+"</a></li>");
    });
  }

});

$.getJSON("/articles", (data) => {
  for (var i = 0; i < data.length; i++) {
    $("#headlines").prepend("<h4 data-id='" + data[i]._id + "'>" + data[i].title + "</h4>" + "<a target='_blank' href='" + data[i].link + "'>" + data[i].link + "</a>" + "<hr>");
  }
});
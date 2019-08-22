$(function () {
  $("#scrape").on("click", function () {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/scrape",
    }).done(function () {
      location.reload();
    })
  });

  $("#clear").on("click", function (event) {
    event.preventDefault();
    $.ajax({
      url: "/scrape",
      type: "DELETE"
    }).then(function () {
      location.reload();
    })
  })

  $(".saveArticle").on("click", function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id")
    $.ajax({
        url: "save/" + id,
        type: "PUT",
        data: {saved: true}
    }).then(function() {
        location.reload();
    });
});

$(".unSaveArticle").on("click", function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id")
    $.ajax({
        url: "remove/" + id,
        type: "PUT",
        data: {saved: false}
    }).then(function() {
        location.reload();
    });
});
  
  
    // Whenever someone clicks a p tag
    $(document).on("click", ".note", function () {
      // Empty the notes from the note section
      $("#notes").empty();
      // Save the id from the p tag
      var thisId = $(this).attr("data-id");
      

    });
});

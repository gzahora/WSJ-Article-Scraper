$(function () {
  $("#scrape").on("click", function () {
    event.preventDefault();
    console.log("scraping...");
    $.ajax({
      method: "GET",
      url: "/scrape",
    }).done(function () {
      location.reload();
    })
  });

  // $("#clear").on("click", function (event) {
  //   event.preventDefault();
  //   $.ajax({
  //     url: "/scrape",
  //     type: "DELETE"
  //   }).then(function () {
  //     location.reload();
  //   })
  // })

  $(".saveArticle").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id")
    console.log(id);

    $.ajax({
      url: "save/" + id,
      type: "PUT",
      data: { saved: true }
    }).then(function () {
    });
  });

  $(".unSaveArticle").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id")
    console.log(id);
    $.ajax({
      url: "remove/" + id,
      type: "PUT",
      data: { saved: false }
    }).then(function () {
      location.reload();
    });
  });

  $(document).on("click", ".note", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    $("#comments-" + thisId).modal("show");
  });

  $(document).on("click", ".saveNote", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id")
    $.ajax({
      url: "articles/" + id,
      type: "PUT",
      data: { author: $("#author").val(), body: $("#body").val() }
    }).then(function () {
      location.reload();
    });
  });
});

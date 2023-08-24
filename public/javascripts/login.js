$(document).ready(function () {
  $("#register").css("display", "none");
  $("#log").click(function () {
    $("#register").css("display", "none");
    $("#login").css("display", "block");
    $("h6").text("");
  });
  $("#reg").click(function () {
    $("#register").css("display", "block");
    $("#login").css("display", "none");
  });
  // $("#signin").click(function () {
  //   let formData = $("#logform");
  // });
});

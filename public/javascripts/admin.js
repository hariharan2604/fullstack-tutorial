$(document).ready(function () {
    $("#filter").click(function () {
        // $("#main").html("");
        let postData = $("#branch :selected").val();
        // console.log(postData);
        $.post("/filter-branch", {data: postData}, function (response) {

        });
    });
});
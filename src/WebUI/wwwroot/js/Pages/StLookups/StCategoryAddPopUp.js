$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/StLookups/GetAllStMainCategory",
        data: "{}",
        success: function (data) {
            var s = '<option value="">اختر</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].id + '">' + data[i].categoryNameAr + '</option>';
            }
            $("#FK_MainCategoryId").html(s);
        }
    });
});

$("#submitStCategoryModal").on('click', function () {
    debugger;

    if ($("#StCategoryModal").valid()) {

        var data = {
            CategoryNameAr: $("#CategoryNameAr").val(),
            CategoryNameEn: $("#CategoryNameEn").val(),
            FK_StMainCategoryId: parseInt($("#FK_MainCategoryId").val()),
            Description: $("#StCategoryDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStCategory",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");
                $("#closeStCategoryModal").click();

            }
        });
    }

});
$("#closeStCategoryModal").on('click', function () {

    $("#CategoryNameAr").val('');
    $("#CategoryNameEn").val('');
    $("#StCategoryDescriptionModal").val('');

});
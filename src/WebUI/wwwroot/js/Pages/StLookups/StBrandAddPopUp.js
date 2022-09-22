$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/StLookups/GetAllStCategory",
        data: "{}",
        success: function (data) {
            var s = '<option value="">اختر</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].id + '">' + data[i].categoryNameAr + '</option>';
            }
            $("#FK_StCategoryForBrandId").html(s);
        }
    });
});  

$("#submitStBrandModal").on('click', function () {
    debugger;

    if ($("#StBrandModal").valid()) {

        var data = {
            BrandNameAr: $("#BrandNameAr").val(),
            BrandNameEn: $("#BrandNameEn").val(),
            FK_StCategoryId: parseInt($("#FK_StCategoryForBrandId").val()),
            Description: $("#StBrandDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStBrand",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StBrandId").append("<option selected='selected' value='" + result.id + "'>" + result.brandNameAr + "</option>");
                $("#closeStBrandModal").click();

            }
        });
    }

});
$("#closeStBrandModal").on('click', function () {

    $("#BrandNameAr").val('');
    $("#BrandNameEn").val('');
    $("#StBrandDescriptionModal").val('');

});

$("#submitClientCategoryModal").on('click', function () {
    debugger;

    if ($("#clientCategoryModal").valid()) {

        var data = {
            CategoryNameAr: $("#CategoryNameAr").val(),
            CategoryNameEn: $("#CategoryNameEn").val(),
            Description: $("#clientCategoryDescriptionModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/RceLookups/RceClientCategoryPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //   $("#FK_RceClientCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");
                $("#FK_RceClientCategoryId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.categoryCode + Resources.SperationChar + result.categoryNameAr });
                $("#FK_RceClientCategoryId").data("kendoDropDownList").value(result.id);
                $("#closeClientCategoryModal").click();

            }
        });
    }

});
$("#closeClientCategoryModal").on('click', function () {

    $("#CategoryNameAr").val('');
    $("#CategoryNameEn").val('');
    $("#clientCategoryDescriptionModal").val('');

});
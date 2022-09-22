
$("#submitDiscountTypeModal").on('click', function () {
    debugger;

    if ($("#discountTypeModal").valid()) {

        var data = {
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            Description: $("#DiscountTypeDescriptionModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/CbDiscountType/CbDiscountTypePopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_CbDiscountTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.typeCode + Resources.SperationChar + result.typeNameAr });
                $("#FK_CbDiscountTypeId").data("kendoDropDownList").value(result.id);

                $("#closeDiscountTypeModal").click();

            }
        });
    }

});
$("#closeDiscountTypeModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#DiscountTypeDescriptionModal").val('');

});
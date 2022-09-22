
$("#submitSupplierCategoryModal").on('click', function () {


    if ($("#supplierCategoryModal").valid()) {

        var data = {
            CategoryNameAr: $("#CategoryNameAr").val(),
            CategoryNameEn: $("#CategoryNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Description: $("#categoryDescriptionModal").val(),
        }
        
        $.ajax({
            url: "/PayLookups/PaySupplierCategoryPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_PaySupplierCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");
                
                $("#FK_PaySupplierCategoryId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.categoryCode + Resources.SperationChar + result.categoryNameAr });
                $("#FK_PaySupplierCategoryId").data("kendoDropDownList").value(result.id);
                $("#closeSupplierCategoryModal").click();

            }
        });
    }

});
$("#closeSupplierCategoryModal").on('click', function () {

    $("#CategoryNameAr").val('');
    $("#CategoryNameEn").val('');
    $("#categoryDescriptionModal").val('');

});
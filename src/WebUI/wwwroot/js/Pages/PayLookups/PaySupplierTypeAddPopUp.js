
$("#submitSupplierTypeModal").on('click', function () {

    var fK_PaySupplierClassId = parseInt($("#FK_PaySupplierClassId").val());
    if (fK_PaySupplierClassId == 0) {
        swal({
            title: Resources.Choose + " " + Resources.SupplierClassResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#supplierTypeModal").valid() && fK_PaySupplierClassId > 0) {

        var data = {
            TypeNameAr: $("#supTypeNameArModal").val(),
            TypeNameEn: $("#supTypeNameEnModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            FK_PaySupplierClassId: fK_PaySupplierClassId,
            Description: $("#typeDescriptionModal").val(),
        }

        $.ajax({
            url: "/PayLookups/PaySupplierTypePopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_PaySupplierCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");

                $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.typeCode + Resources.SperationChar + result.typeNameAr });
                $("#FK_PaySupplierType").data("kendoDropDownList").value(result.id);
                $("#closeSupplierTypeModal").click();

            }
        });


    }

});
$("#closeSupplierTypeModal").on('click', function () {

    $("#supTypeNameArModal").val('');
    $("#supTypeNameEnModal").val('');
    $("#typeDescriptionModal").val('');

});
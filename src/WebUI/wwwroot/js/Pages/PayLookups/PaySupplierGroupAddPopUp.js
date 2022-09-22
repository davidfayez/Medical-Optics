
$("#submitSupplierGroupModal").on('click', function () {

    var fK_PaySupplierCategoryId = parseInt($("#FK_PaySupplierCategoryId").val());
    debugger
    if (fK_PaySupplierCategoryId == 0) {
        swal({
            title: Resources.Choose + " " + Resources.SupplierCategoryResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#supplierGroupModal").valid() && fK_PaySupplierCategoryId > 0) {


        var data = {
            GroupNameAr: $("#GroupNameAr").val(),
            GroupNameEn: $("#GroupNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            FK_PaySupplierCategoryId: fK_PaySupplierCategoryId,
            Description: $("#groupDescriptionModal").val(),
        }
        $.ajax({
            url: "/PayLookups/PaySupplierGroupPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_PaySupplierCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");

                $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.groupCode + Resources.SperationChar + result.groupNameAr });
                $("#FK_PaySupplierGroupId").data("kendoDropDownList").value(result.id);
                $("#closeSupplierGroupModal").click();

            }
        });


    }

});
$("#closeSupplierGroupModal").on('click', function () {

    $("#GroupNameAr").val('');
    $("#GroupNameEn").val('');
    $("#groupDescriptionModal").val('');

});
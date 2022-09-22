$("#submitSupplierClassModal").on('click', function () {
    debugger
    var fK_PaySupplierGroupId = parseInt($("#FK_PaySupplierGroupId").val());
    if (fK_PaySupplierGroupId == 0) {
        swal({
            title: Resources.Choose + " " + Resources.SupplierGroupResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#supplierClassModal").valid() && fK_PaySupplierGroupId > 0) {

        var data = {
            ClassNameAr: $("#ClassNameAr").val(),
            ClassNameEn: $("#ClassNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Description: $("#ClassDescriptionModal").val(),
            FK_PaySupplierGroupId: fK_PaySupplierGroupId,
        }

        $.ajax({
            url: "/PayLookups/PaySupplierClassPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //  $("#FK_PaySupplierClassId").append("<option selected='selected' value='" + result.id + "'>" + result.classNameAr + "</option>");
                $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.classCode + Resources.SperationChar + result.classNameAr });
                $("#FK_PaySupplierClassId").data("kendoDropDownList").value(result.id);
                $("#closeSupplierClassModal").click();

            }
        });

    }

});
$("#closeSupplierClassModal").on('click', function () {
    debugger;
    $("#ClassNameAr").val('');
    $("#ClassNameEn").val('');
    $("#ClassDescriptionModal").val('');

});
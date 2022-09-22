
$("#submitClientTypeModal").on('click', function () {

    var fK_RceClientClassId = parseInt($("#FK_RceClientClassId").val());
    if (fK_RceClientClassId == 0) {
        swal({
            title: Resources.Choose + " " + Resources.ClientClassResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#clientTypeModal").valid() && fK_RceClientClassId > 0) {

        var data = {
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            FK_RceClientClassId: fK_RceClientClassId,
            Description: $("#clientTypeDescriptionModal").val(),
        }

        $.ajax({
            url: "/RceLookups/RceClientTypePopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_PaySupplierCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");

                $("#FK_RceClientType").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.typeCode + Resources.SperationChar + result.typeNameAr });
                $("#FK_RceClientType").data("kendoDropDownList").value(result.id);
                $("#closeClientTypeModal").click();

            }
        });


    }

});
$("#closeClientTypeModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#clientTypeDescriptionModal").val('');

});
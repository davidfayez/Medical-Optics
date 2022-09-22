$("#submitClientGroupModal").on('click', function () {

    var fK_RceClientCategoryId = parseInt($("#FK_RceClientCategoryId").val());
    debugger
    if (fK_RceClientCategoryId == 0) {
        swal({
            title: Resources.Choose + " " + Resources.ClientCategoryResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#clientGroupModal").valid() && fK_RceClientCategoryId > 0) {


        var data = {
            GroupNameAr: $("#GroupNameAr").val(),
            GroupNameEn: $("#GroupNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            FK_RceClientCategoryId: fK_RceClientCategoryId,
            Description: $("#clientGroupDescriptionModal").val(),
        }
        $.ajax({
            url: "/RceLookups/RceClientGroupPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_PaySupplierCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");

                $("#FK_RceClientGroupId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.groupCode + Resources.SperationChar + result.groupNameAr });
                $("#FK_RceClientGroupId").data("kendoDropDownList").value(result.id);
                $("#closeClientGroupModal").click();

            }
        });


    }

});
$("#closeClientGroupModal").on('click', function () {

    $("#GroupNameAr").val('');
    $("#GroupNameEn").val('');
    $("#clientGroupDescriptionModal").val('');

});
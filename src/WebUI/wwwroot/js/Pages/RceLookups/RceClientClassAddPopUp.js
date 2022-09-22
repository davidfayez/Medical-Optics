
$("#submitClientClassModal").on('click', function () {
    debugger
    var fK_RceClientGroupId = parseInt($("#FK_RceClientGroupId").val());
    if (fK_RceClientGroupId == 0) {
        swal({
            title: Resources.Choose + " " + Resources.ClientGroupResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#clientClassModal").valid() && fK_RceClientGroupId > 0) {

        var data = {
            ClassNameAr: $("#ClassNameAr").val(),
            ClassNameEn: $("#ClassNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Description: $("#clientClassDescriptionModal").val(),
            FK_RceClientGroupId: fK_RceClientGroupId,
        }

        $.ajax({
            url: "/RceLookups/PayRceClientClassPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //  $("#FK_PaySupplierClassId").append("<option selected='selected' value='" + result.id + "'>" + result.classNameAr + "</option>");
                $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.classCode + Resources.SperationChar + result.classNameAr });
                $("#FK_RceClientClassId").data("kendoDropDownList").value(result.id);
                $("#closeClientClassModal").click();

            }
        });

    }

});
$("#closeClientClassModal").on('click', function () {
    debugger;
    $("#ClassNameAr").val('');
    $("#ClassNameEn").val('');
    $("#clientClassDescriptionModal").val('');

});

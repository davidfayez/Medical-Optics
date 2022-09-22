
$("#submitAllowanceTypeModal").on('click', function () {
    debugger;

    if ($("#AllowanceTypeModal").valid()) {

        var data = {
            TypeNameAr: $("#AllowanceTypeNameAr").val(),
            TypeNameEn: $("#AllowanceTypeNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Description: $("#AllowanceTypeDescriptionModal").val(),
        }

        $.ajax({
            url: "/HrLookups/PopUpCreateAllowanceType",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_HrAllowanceTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#FK_HrAllowanceTypeId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.typeCode + Resources.SperationChar + result.typeNameAr });
                $("#FK_HrAllowanceTypeId").data("kendoDropDownList").value(result.id);
                $("#closeAllowanceTypeModal").click();

            }
        });
    }

});
$("#closeAllowanceTypeModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#AllowanceTypeDescriptionModal").val('');

});

$("#submitQualificationTypeModal").on('click', function () {
    debugger;

    if ($("#QualificationTypeModal").valid()) {

        var data = {
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Description: $("#QualificationTypeDescriptionModal").val(),
        }

        $.ajax({
            url: "/HrLookups/PopUpCreateQualificationType",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_HrQualificationTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#FK_HrQualificationTypeId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.typeCode + " " + result.typeNameAr });
                $("#FK_HrQualificationTypeId").data("kendoDropDownList").value(result.id);
                $("#closeQualificationTypeModal").click();

            }
        });
    }

});
$("#closeQualificationTypeModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#QualificationTypeDescriptionModal").val('');

});
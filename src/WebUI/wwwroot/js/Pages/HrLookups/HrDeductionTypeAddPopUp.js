
$("#submitDeductionTypeModal").on('click', function () {
    debugger;

    if ($("#DeductionTypeModal").valid()) {

        var data = {
            TypeNameAr: $("#DeductionTypeNameAr").val(),
            TypeNameEn: $("#DeductionTypeNameEn").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            Description: $("#DeductionTypeDescriptionModal").val(),
        }

        $.ajax({
            url: "/HrLookups/PopUpCreateDeductionType",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_HrDeductionTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");

                $("#FK_HrDeductionTypeId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.typeCode + " " + result.typeNameAr });
                $("#FK_HrDeductionTypeId").data("kendoDropDownList").value(result.id);
                $("#closeDeductionTypeModal").click();

            }
        });
    }

});
$("#closeDeductionTypeModal").on('click', function () {

    $("#DeductionTypeNameAr").val('');
    $("#DeductionTypeNameEn").val('');
    $("#DeductionTypeDescriptionModal").val('');

});

$("#submitContractTypeModal").on('click', function () {

    if ($("#ContractTypeModal").valid()) {

        var data = {
            TypeNameAr: $("#ContractTypeNameAr").val(),
            TypeNameEn: $("#ContractTypeNameEn").val(),
            Description: $("#contractTypeDescriptionModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/HrLookups/PopUpCreateContractType",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //   $("#FK_HrContractTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");

                $("#FK_HrContractTypeId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.typeCode + " " + result.typeNameAr });
                $("#FK_HrContractTypeId").data("kendoDropDownList").value(result.id);
                $("#closeContractTypeModal").click();

            }
        });
    }

});
$("#closeContractTypeModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#contractTypeDescriptionModal").val('');

});
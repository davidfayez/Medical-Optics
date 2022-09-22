
$("#submitDeliveryConditionModal").on('click', function () {
    debugger;

    if ($("#payDeliveryConditionModal").valid()) {

        var data = {
            ConditionNameAr: $("#deliveryConditionNameAr").val(),
            ConditionNameEn: $("#deliveryConditionNameEn").val(),
            Description: $("#deliveryConditionDescriptionModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/PayLookups/PayDeliveryConditionPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //  $("#FK_PayDeliveryConditionId").append("<option selected='selected' value='" + result.id + "'>" + result.conditionNameAr + "</option>");
                $("#FK_PayDeliveryConditionId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.conditionCode + Resources.SperationChar + result.conditionNameAr });
                $("#FK_PayDeliveryConditionId").data("kendoDropDownList").value(result.id);
                $("#closeDeliveryConditionModal").click();

            }
        });
    }

});
$("#closeDeliveryConditionModal").on('click', function () {

    $("#deliveryConditionNameAr").val('');
    $("#deliveryConditionNameEn").val('');
    $("#deliveryConditionDescriptionModal").val('');

});
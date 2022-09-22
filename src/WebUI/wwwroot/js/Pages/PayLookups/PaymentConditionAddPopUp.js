
$("#submitPaymentConditionModal").on('click', function () {
    debugger;

    if ($("#paymentConditionModal").valid()) {

        var data = {
            ConditionNameAr: $("#ConditionNameAr").val(),
            ConditionNameEn: $("#ConditionNameEn").val(),
            Description: $("#PaymentConditionDescriptionModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/PayLookups/PaymentConditionPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_PaymentConditionId").append("<option selected='selected' value='" + result.id + "'>" + result.conditionNameAr + "</option>");
                $("#FK_PaymentConditionId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.conditionCode + Resources.SperationChar + result.conditionNameAr });
                $("#FK_PaymentConditionId").data("kendoDropDownList").value(result.id);
                $("#closePaymentConditionModal").click();

            }
        });
    }

});
$("#closePaymentConditionModal").on('click', function () {

    $("#ConditionNameAr").val('');
    $("#ConditionNameEn").val('');
    $("#PaymentConditionDescriptionModal").val('');

});
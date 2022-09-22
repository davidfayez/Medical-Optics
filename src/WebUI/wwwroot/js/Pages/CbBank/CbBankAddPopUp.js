
$("#submitBankModal").on('click', function () {
    debugger;

    if ($("#bankModal").valid()) {

        var data = {
            BankNameAr: $("#BankNameAr").val(),
            BankNameEn: $("#BankNameEn").val(),
            SwiftCode: $("#SwiftCode").val(),
            IBAN: $("#IBAN").val(),
            Description: $("#bankDescriptionModal").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/CbBank/CbBankPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_CbBankId").append("<option selected='selected' value='" + result.id + "'>" + result.bankNameAr + "</option>");

                $("#FK_CbBankId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.bankCode + Resources.SperationChar + result.bankNameAr });
                $("#FK_CbBankId").data("kendoDropDownList").value(result.id);
                $("#closeBankModal").click();

            }
        });
    }

});
$("#closeBankModal").on('click', function () {

    $("#BankNameAr").val('');
    $("#BankNameEn").val('');
    $("#SwiftCode").val('');
    $("#IBAN").val('');
    $("#bankDescriptionModal").val('');

});

$("#submitBankBranchModal").on('click', function () {
    debugger;
    if (parseInt($("#FK_CbBankId").val()) == 0) {
        swal({
            title: Resources.ChooseResource + " " + Resources.Bank,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    if ($("#bankBranchModal").valid() && parseInt($("#FK_CbBankId").val())) {

        var branchData = {
            BranchNameAr: $("#BranchNameAr").val(),
            BranchNameEn: $("#BranchNameEn").val(),
            FK_CbBankId: parseInt($("#FK_CbBankId").val()),
            Description: $("#branchDescriptionModal").val(),
        }

        $.ajax({
            url: "/CbBank/CbBankBranchPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(branchData),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_CbBankId").append("<option selected='selected' value='" + result.id + "'>" + result.bankNameAr + "</option>");
                $("#FK_CbBankBranchId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.branchCode + Resources.SperationChar + result.branchNameAr });
                $("#FK_CbBankBranchId").data("kendoDropDownList").value(result.id);

                $("#closeBankBranchModal").click();

            }
        });
    }

});
$("#closeBankBranchModal").on('click', function () {

    $("#BranchNameAr").val('');
    $("#BranchNameEn").val('');
    $("#branchDescriptionModal").val('');

});
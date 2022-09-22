$(document).ready(function () {
    //$("#CostCenterCode").blur(function () {
    //    validCostCenterCode();
    //});
});

var _validcode = false;
function validCostCenterCode() {
    $("#mainForm").valid();
    //var code = $("#CostCenterCode").val();
    //if (code == "") {
    //    return false;
    //}
    $.ajax({
        url: '/CostCenter/CodeValidate/' + code,
        success: (e) => {
            if (e == "true") {
                $("#validCostCenterCode").text("");
                _validcode = true;
            } else {
                $("#validCostCenterCode").text(e);
                _validcode = false;
            }
        }
    });

    return _validcode;
}

$("#submitCostCenterModal").on('click', function () {
    //debugger;
    //if (!validCostCenterCode()) {
    //    return false;
    //}
    if ($("#costCenterModal").valid()) {


        var cDate = new Date($("#CreationDate").text());
        var lDate = new Date($("#LastModifiedDate").text());
        var data = {
            Id: 0,
            CostCenterCode: $("#CostCenterCodeModal").val(),
            CostCenterNameAr: $("#CostCenterNameAr").val(),
            CostCenterNameEn: $("#CostCenterNameEn").val(),
            Description: $("#costCenterDescription").val(),
            FK_CreatorId: 1,
            CreationDate: cDate,
            LastModifiedDate: lDate,
            IsActive: true,
            IsDeleted: false,

        }

        $.ajax({
            url: "/CostCenter/SaveCreatePopUp",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#CostCenterName").append("<option selected='selected' value='" + result.id + "'>" + result.costCenterNameAr + "</option>");
                $("#CostCenterCode").append("<option selected='selected' value='" + result.id + "'>" + result.costCenterCode + "</option>");
                $("#Cost-center").modal('toggle');
            }
        });
    }

});
$("#closeCostCenterModal").on('click', function () {
    $("#CostCenterCodeModal").val('');
    $("#CostCenterCodeModal-error").text('');
    $("#CostCenterNameAr").val('');
    $("#CostCenterNameAr-error").text('');
    $("#CostCenterNameEn").val('');
    $("#CostCenterNameEn-error").text('');
    $("#costCenterDescription").val('');
});
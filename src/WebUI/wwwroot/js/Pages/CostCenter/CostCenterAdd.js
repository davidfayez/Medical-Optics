$(document).ready(function () {
    $("#CostCenterCode").blur(function () {
        validCostCenterCode();
    });

    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingReasons").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });
});

var _validcode = false;
function validCostCenterCode() {
    $("#mainForm").valid();
    var code = $("#CostCenterCode").val();
    if (code == "") {
        return false;
    }
    $.ajax({
        url: '/CostCenter/CheckCostCenterCodeExist?code=' + code,
        success: (e) => {
            debugger;
            if (e == false) {
                return true;
            } else {
                $("#CostCenterCode").val("");
                swal({
                    title: Resources.CostCenterCodeIsExistResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
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
            url: "/GlCostCenter/SaveCreatePopUp",
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
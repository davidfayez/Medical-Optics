$(document).ready(function () {
    $("#CostCenterCode").blur(function () {
        validCode();
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
    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == "False") {
        $(".disabled-input").removeAttr('disabled');
    }

});

var _validcode = false;
function validCode() {

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

function removeCostCenterEdit(Id) {

    swal({
        title: Resources.DeleteResource,
        text: Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/CostCenter/RemoveCostCenter?Id=" + Id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                                window.location.href = '/CostCenter/Index'
                        });
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}
$(document).ready(function () {
    $("#CostCenterCode").blur(function () {
        validCode();
    });
});

var _validcode = false;
function validCode() {

    var code = $("#CostCenterCode").val();
    if (code == "") {
        return false;
    }
    $.ajax({
        url: '/CostCenter/CodeValidate/' + code,
        success: (e) => {
            if (e == "true") {
                $("#validCode").text("");
                _validcode = true;
            } else {
                $("#validCode").text(e);
                _validcode = false;
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
﻿function removeCurrencyEdit(id) {

    swal({
        title: Resources.DeleteResource,
        text:  Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText:  Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/DefCurrency/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/DefCurrency/Index'
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

$("#submitCurrencyEdit").on('click', function () {

    if ($("#currencyFormEdit").valid()) {
        var isPimary = $("input[name='isPimary']:checked").val();
        var id = $("#hiddenId").val()
        if (isPimary == "True") {
            $.ajax({
                url: "/DefCurrency/CheckIsPimary?id=" + id,
                type: "post",
                contentType: 'application/json',

                success: function (result) {
                    debugger
                    if (result) {
                        debugger;
                        $("#currencyFormEdit").submit();
                    }
                    else {

                        swal({
                            title: Resources.WarningResource,
                            text:  Resources.ChangeMainCurrencyResource,
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: Resources.ChangeResource,
                            cancelButtonText:  Resources.CancelResource,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        }, function () {

                            setTimeout(function () {
                                swal({
                                    title: Resources.ChangedSuccessfullyResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                }, function () {
                                    $("#currencyFormEdit").submit();
                                });

                            }, 2000);
                        });
                    }

                },
            });
        }
        else
            $("#currencyFormEdit").submit();


    }

});

//$("#Code").blur(function () {
//    validCurrencyCode();
//});


//var _validcode = false;
//function validCurrencyCode() {

//    var code = $("#Code").val();
//    if (code == "") {
//        return false;
//    }
//    $.ajax({
//        url: '/DefCurrency/CodeValidate/' + code,
//        success: (e) => {
//            if (e == "true") {
//                $("#validCurrencyCode").text("");
//                _validcode = true;
//            } else {
//                $("#validCurrencyCode").text(e);
//                _validcode = false;
//            }
//        }
//    });

//    return _validcode;
//}
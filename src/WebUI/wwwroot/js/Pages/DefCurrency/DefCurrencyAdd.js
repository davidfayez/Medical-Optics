$("#submitCurrency").on('click', function () {

    if ($("#currencyFormAdd").valid()) {
        var isPimary = $("input[name='isPimary']:checked").val();
        if (isPimary == "True") {
            $.ajax({
                url: "/DefCurrency/CheckIsPimary/",
                type: "post",
                contentType: 'application/json',

                success: function (result) {
                    if (result) {
                        $("#currencyFormAdd").submit();
                    }
                    else {

                        swal({
                            title: Resources.WarningResource,
                            text: Resources.ChangeMainCurrencyResource,
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: Resources.ChangeResource,
                            cancelButtonText: Resources.CancelResource,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        }, function () {

                            setTimeout(function () {
                                swal({
                                    title: Resources.ChangedSuccessfullyResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                }, function () {
                                    $("#currencyFormAdd").submit();
                                });

                            }, 2000);
                        });
                    }

                },
            });
        }
        else
            $("#currencyFormAdd").submit();


    }

});

$("#submitCurrencyModal").on('click', function () {

    if ($("#CreateCurrencyModal").valid()) {

        var data = {
            Id: 0,
            CurrencyNameAr: $("#CurrencyNameAr").val(),
            CurrencyNameEn: $("#CurrencyNameEn").val(),
            AbbreviationAr: $("#AbbreviationAr").val(),
            AbbreviationEn: $("#AbbreviationEn").val(),
            DefaultFactor: parseFloat($("#DefaultFactor").val()),
            Notes: $("#NotesCurrncy").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),

        }

        $.ajax({
            url: "/DefCurrency/SaveCreatePopUp",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_DefCurrencyId").append("<option selected='selected' value='" + result.id + "'>" + result.currencyNameAr + "</option>");
                $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.add({ id: result.id, codeAndName: result.code + Resources.SperationChar + result.currencyNameAr });
                $("#FK_DefCurrencyId").data("kendoDropDownList").value(result.id);
                $("#Def-Currency").modal('toggle');
            }
        });
    }

});

//$("#Code").blur(function () {
//    validCurrencyCode();
// });


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

$("#closeCurrencyModal").on('click', function () {
    $("#Code").val('');
    $("#validCurrencyCode").text('');
    $("#CurrencyNameAr").val('');
    $("#CurrencyNameAr-error").text('');
    $("#CurrencyNameEn").val('');
    $("#CurrencyNameEn-error").text('');
    $("#AbbreviationAr").val('');
    $("#AbbreviationAr-error").text('');
    $("#AbbreviationEn").val('');
    $("#AbbreviationEn-error").text('');
    $("#DefaultFactor").val('');
    $("#DefaultFactor-error").text('');
    $("#NotesCurrncy").val('');
});
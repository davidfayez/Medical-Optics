$(function () {

    if ($('#DateCheck_X').val() != "" || $('#DateCheck_Y').val() != "" || $('#DateCheck_Z').val() != "") {
        $(".DateCheck").removeAttr('disabled');
        $("#isDateCheck").attr("checked", "checked");
    }
    if ($('#Recipient_X').val() != "" || $('#Recipient_Y').val() != "" || $('#Recipient_Z').val() != "") {
        $(".Recipient").removeAttr('disabled');
        $("#isRecipient").attr("checked", "checked");
    }
    if ($('#Amount_X').val() != "" || $('#Amount_Y').val() != "" || $('#Amount_Z').val() != "") {
        $(".Amount").removeAttr('disabled');
        $("#isAmount").attr("checked", "checked");
    }
    if ($('#Fraction_X').val() != "" || $('#Fraction_Y').val() != "" || $('#Fraction_Z').val() != "") {
        $(".Fraction").removeAttr('disabled');
        $("#isFraction").attr("checked", "checked");
    }
    if ($('#AmountText_X').val() != "" || $('#AmountText_Y').val() != "" || $('#AmountText_Z').val() != "") {
        $(".AmountText").removeAttr('disabled');
        $("#isAmountText").attr("checked", "checked");
    }
    if ($('#Description_X').val() != "" || $('#Description_Y').val() != "" || $('#Description_Z').val() != "") {
        $(".Description").removeAttr('disabled');
        $("#isDescription").attr("checked", "checked");
    }
    if ($('#Line_X').val() != "" || $('#Line_Y').val() != "" || $('#Line_Z').val() != "") {
        $(".Line").removeAttr('disabled');
        $("#isLine").attr("checked", "checked");
    }
    if ($('#WrittenIn_X').val() != "" || $('#WrittenIn_Y').val() != "" || $('#WrittenIn_Z').val() != "") {
        $(".WrittenIn").removeAttr('disabled');
        $("#isWrittenIn").attr("checked", "checked");
    }
});

$("#isDateCheck").on('click', function () {

    if ($('#isDateCheck').is(':checked'))
        $(".DateCheck").removeAttr('disabled');

    else {
        $(".DateCheck").attr("disabled", "disabled");
        $(".DateCheck").val(null);
    }
});
$("#isRecipient").on('click', function () {

    if ($('#isRecipient').is(':checked'))
        $(".Recipient").removeAttr('disabled');
    else {
        $(".Recipient").attr("disabled", "disabled");
        $(".Recipient").val(null);
    }

});
$("#isAmount").on('click', function () {

    if ($('#isAmount').is(':checked'))
        $(".Amount").removeAttr('disabled');
    else {
        $(".Amount").attr("disabled", "disabled");
        $(".Amount").val(null);
    }

});
$("#isFraction").on('click', function () {

    if ($('#isFraction').is(':checked'))
        $(".Fraction").removeAttr('disabled');
    else {
        $(".Fraction").attr("disabled", "disabled");
        $(".Fraction").val(null);
    }
});
$("#isAmountText").on('click', function () {

    if ($('#isAmountText').is(':checked'))
        $(".AmountText").removeAttr('disabled');
    else {
        $(".AmountText").attr("disabled", "disabled");
        $(".AmountText").val(null);
    }

});
$("#isDescription").on('click', function () {

    if ($('#isDescription').is(':checked'))
        $(".Description").removeAttr('disabled');
    else {
        $(".Description").attr("disabled", "disabled");
        $(".Description").val(null);
    }

});
$("#isLine").on('click', function () {

    if ($('#isLine').is(':checked'))
        $(".Line").removeAttr('disabled');
    else {
        $(".Line").attr("disabled", "disabled");
        $(".Line").val(null);
    }
});
$("#isWrittenIn").on('click', function () {

    if ($('#isWrittenIn').is(':checked'))
        $(".WrittenIn").removeAttr('disabled');
    else {
        $(".WrittenIn").attr("disabled", "disabled");
        $(".WrittenIn").val(null);
    }
});

$("#saveCbCheckFormEdit").on('click', function () {

    if ($("#CbCheckFormEdit").valid()) {
        var formValid = true;
        if ($('#isDateCheck').is(':checked')) {
            if ($('#DateCheck_X').val() == "" || $('#DateCheck_Y').val() == "" || $('#DateCheck_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.DateCheckNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isRecipient').is(':checked')) {
            if ($('#Recipient_X').val() == "" || $('#Recipient_Y').val() == "" || $('#Recipient_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.RecipientNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isAmount').is(':checked')) {
            if ($('#Amount_X').val() == "" || $('#Amount_Y').val() == "" || $('#Amount_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.AmountNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isFraction').is(':checked')) {
            if ($('#Fraction_X').val() == "" || $('#Fraction_Y').val() == "" || $('#Fraction_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.FractionNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isAmountText').is(':checked')) {
            if ($('#AmountText_X').val() == "" || $('#AmountText_Y').val() == "" || $('#AmountText_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.AmountTextNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isDescription').is(':checked')) {
            if ($('#Description_X').val() == "" || $('#Description_Y').val() == "" || $('#Description_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.DescriptionNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isLine').is(':checked')) {
            if ($('#Line_X').val() == "" || $('#Line_Y').val() == "" || $('#Line_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.LineNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }
        if ($('#isWrittenIn').is(':checked')) {
            if ($('#WrittenIn_X').val() == "" || $('#WrittenIn_Y').val() == "" || $('#WrittenIn_Z').val() == "") {
                formValid = false;
                swal({
                    title: Resources.WrittenInNotCompletedResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
        }

        if (formValid) {
            $("#CbCheckFormEdit").submit();
        }

    }

});

function removeCheckFormEdit(id) {

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
                url: "/CbCheckForm/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbCheckForm/Index'
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
$(document).ready(function () {


});
function getTotalBalance() {

    var DurationOne = isNaN(parseFloat($("#DurationOne").val())) ? 0 : parseFloat($("#DurationOne").val()),
        DurationTwo = isNaN(parseFloat($("#DurationTwo").val())) ? 0 : parseFloat($("#DurationTwo").val()),
        DurationThree = isNaN(parseFloat($("#DurationThree").val())) ? 0 : parseFloat($("#DurationThree").val()),
        DurationFour = isNaN(parseFloat($("#DurationFour").val())) ? 0 : parseFloat($("#DurationFour").val()),
        DurationFive = isNaN(parseFloat($("#DurationFive").val())) ? 0 : parseFloat($("#DurationFive").val()),
        DurationSix = isNaN(parseFloat($("#DurationSix").val())) ? 0 : parseFloat($("#DurationSix").val()),

        totalBalance = DurationOne + DurationTwo + DurationThree + DurationFour + DurationFive + DurationSix;

    $("#totalBalance").val(totalBalance.toFixed(2));

}
function clearCredit() {
    $('#DCredit').val(null);
}
function clearDebit() {
    $('#DDebit').val(null);
}

function saveDuration() {
    debugger
    var credit = parseFloat($('#DCredit').val()),
        debit = parseFloat($('#DDebit').val()),
        DurationOne = parseFloat($("#DurationOne").val()),
        DurationTwo = parseFloat($("#DurationTwo").val()),
        DurationThree = parseFloat($("#DurationThree").val()),
        DurationFour = parseFloat($("#DurationFour").val()),
        DurationFive = parseFloat($("#DurationFive").val()),
        DurationSix = parseFloat($("#DurationSix").val()),
        totalBalance = $("#totalBalance").val();



    if (isNaN(credit) && isNaN(debit)) {

        swal({
            title: Resources.EnterRequiredResource + " " + Resources.TotalDebit + " " + Resources.Or + " " + Resources.TotalCredit,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    } else if (totalBalance == "" || totalBalance == "0") {

        swal({
            title: Resources.MustEnterOneDuration,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    } else if (credit > 0 && credit != totalBalance) {
        swal({
            title: Resources.TotalCreditNotEqualBalance,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (debit > 0 && debit != totalBalance) {
        swal({
            title: Resources.TotalDebitNotEqualBalance,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (credit == totalBalance || debit == totalBalance) {
        var submit = $("#durationForm").submit();
     
    } else {
        swal({
            title: Resources.ErrorMsgResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    
}



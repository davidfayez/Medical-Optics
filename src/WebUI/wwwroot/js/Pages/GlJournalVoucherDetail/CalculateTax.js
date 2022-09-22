$(document).ready(function () {

    $("#IsAmountIncluldeTax").change(function () {
        $("#TotalTaxAmount").val(0);
        var creditValue = parseFloat($('#Credit').val());
        var debitValue = parseFloat($('#Debit').val());
        var taxPercentage = parseFloat($('#TaxPercentage').val());
        var result = 0;
        if ($(this).is(':checked')) {

            if (creditValue > 0) {
                var creditWithoutTax = parseFloat(creditValue / (1 + (taxPercentage / 100))).toFixed(2);
                result = parseFloat(creditValue - creditWithoutTax).toFixed(2);
            }
            if (debitValue > 0) {
                var debitWithoutTax = parseFloat(debitValue / (1 + (taxPercentage / 100))).toFixed(2);
                result = parseFloat(debitValue - debitWithoutTax).toFixed(2);
            }

        } else {
            if (creditValue > 0) {
                result = creditValue * (taxPercentage / 100).toFixed(2);
            }
            else {
                result = debitValue * (taxPercentage / 100).toFixed(2);
            }
        }
        //  SetTaxValue();
        $("#TotalTaxAmount").val(result);
    });

});
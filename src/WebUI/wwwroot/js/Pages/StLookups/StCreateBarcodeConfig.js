$(document).ready(function () {

    $('#IsItemNameInclude').change(function () {
        debugger;
        if (this.checked) {
            $("#ProductName").show();
        }
        else {
            $("#ProductName").hide();

        }
    });

    $('#IsSalePriceInclude').change(function () {
        if (this.checked) {
            $("#SellingPrice").show();

        }
        else {
            $("#SellingPrice").hide();

        }
    });

    $('#IsExpiryDateInclude').change(function () {
        if (this.checked) {
            $("#ExpirationDate").show();

        }
        else {
            $("#ExpirationDate").hide();

        }
    });

    $('#IsManufacturingCountryInclude').change(function () {
        if (this.checked) {
            $("#ManufactureCountry").show();

        }
        else {
            $("#ManufactureCountry").hide();

        }
    });

    $(document).on('change', '#BarcodeCode', function () {
        debugger;
        var barcode = $("#BarcodeCode").val();
        $("#Barcode").val(barcode);
        //$("#Barcode").text(startValue);
        

    $.ajax({
        url: "/StLookups/PreviewBarcode?barcodeCode=" + barcode,
        type: "Get",
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            debugger;
            if (result!="") {
                document.getElementById("Preview").src = result;

            }
            else {

            }
        },
        error: function (err, xqr, txt) { }
    });
    });
});
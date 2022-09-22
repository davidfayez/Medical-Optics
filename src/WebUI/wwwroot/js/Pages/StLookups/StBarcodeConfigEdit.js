
$(document).ready(function () {

    if ($('#IsItemNameInclude').prop("checked")) 
        $("#ProductName").show();

    if ($('#IsSalePriceInclude').prop("checked"))
        $("#SellingPrice").show();

    if ($('#IsExpiryDateInclude').prop("checked"))
        $("#ExpirationDate").show();

    if ($('#IsManufacturingCountryInclude').prop("checked"))
        $("#ManufactureCountry").show();

    var barcode = $("#BarcodeCode").val();
    //$("#Barcode").val(barcode);


    $.ajax({
        url: "/StLookups/PreviewBarcode?barcodeCode=" + barcode,
        type: "Get",
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            debugger;
            if (result != "") {
                document.getElementById("Preview").src = result;

            }
            else {

            }
        },
        error: function (err, xqr, txt) { }
    });

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
                if (result != "") {
                    document.getElementById("Preview").src = result;

                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });
});
function removeStBarcodeConfig(id) {


    swal({
        title: Resources.DeleteResource ,
        text:  Resources.DeleteConfirmResource ,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText:  Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/StLookups/DeleteStBarcodeConfig?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        //grid.refresh();
                        //grid.dataSource.filter(filters);
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../StLookups/IndexStBarcodeConfig";
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
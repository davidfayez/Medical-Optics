
$("#submitTaxModal").on('click', function () {
    debugger;

    if ($("#TaxModal").valid()) {

        var data = {
            TaxNameAr: $("#TaxNameAr").val(),
            TaxNameEn: $("#TaxNameEn").val(),
            Description: $("#TaxDescriptionModal").val(),
        }

        $.ajax({
            url: "/Tax/TaxPopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_TaxesId").append("<option selected='selected' value='" + result.id + "'>" + result.taxNameAr + "</option>");
                $("#closeTaxModal").click();

            }
        });
    }

});
$("#closeTaxModal").on('click', function () {

    $("#TaxNameAr").val('');
    $("#TaxNameEn").val('');
    $("#TaxDescriptionModal").val('');

});
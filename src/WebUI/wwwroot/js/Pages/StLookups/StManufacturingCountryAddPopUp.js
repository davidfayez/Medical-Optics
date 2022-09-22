
$("#submitStManufacturingCountryModal").on('click', function () {
    debugger;

    if ($("#StManufacturingCountryModal").valid()) {

        var data = {
            CountryNameAr: $("#CountryNameAr").val(),
            CountryNameEn: $("#CountryNameEn").val(),
            Description: $("#StManufacturingCountryDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStManufacturingCountry",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StManufacturingCountryId").append("<option selected='selected' value='" + result.id + "'>" + result.countryNameAr + "</option>");
                $("#closeStManufacturingCountryModal").click();

            }
        });
    }

});
$("#closeStManufacturingCountryModal").on('click', function () {

    $("#CountryNameAr").val('');
    $("#CountryNameEn").val('');
    $("#StManufacturingCountryDescriptionModal").val('');

});

$("#submitCountryModal").on('click', function () {
    debugger;

    if ($("#CountryModal").valid()) {

        var data = {
            CountryNameAr: $("#CountryNameAr").val(),
            CountryNameEn: $("#CountryNameEn").val(),
            CapitalNameAr:  $("#CapitalNameAr").val(),
            CapitalNameEn:  $("#CapitalNameEn").val(),
            Description: $("#countryDescriptionModal").val(),
        }

        $.ajax({
            url: "/DefCountry/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_DefCountryId").append("<option selected='selected' value='" + result.id + "'>" + result.countryNameAr + "</option>");
                $("#closeCountryModal").click();

            }
        });
    }

});
$("#closeCountryModal").on('click', function () {

    $("#CountryNameAr").val('');
    $("#CountryNameEn").val('');
    $("#CapitalNameAr").val();
    $("#CapitalNameEn").val();
    $("#countryDescriptionModal").val('');

});
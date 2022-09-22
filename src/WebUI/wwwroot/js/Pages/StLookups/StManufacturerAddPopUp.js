
$("#submitStManufacturerModal").on('click', function () {
    debugger;

    if ($("#StManufacturerModal").valid()) {

        var data = {
            ManufacturerNameAr: $("#ManufacturerNameAr").val(),
            ManufacturerNameEn: $("#ManufacturerNameEn").val(),
            Address: $("#Address").val(),
            Mail: $("#Mail").val(),
            Phone: $("#Phone").val(),
            Description: $("#StManufacturerDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStManufacturer",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StManufacturerId").append("<option selected='selected' value='" + result.id + "'>" + result.manufacturerNameAr + "</option>");
                $("#closeStManufacturerModal").click();

            }
        });
    }

});
$("#closeStManufacturerModal").on('click', function () {

    $("#ManufacturerNameAr").val('');
    $("#ManufacturerNameEn").val('');
    $("#StManufacturerDescriptionModal").val('');

});
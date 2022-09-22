
$("#submitStItemLocationModal").on('click', function () {
    debugger;

    if ($("#StItemLocationModal").valid()) {

        var data = {
            LocationNameAr: $("#LocationNameAr").val(),
            LocationNameEn: $("#LocationNameEn").val(),
            Description: $("#StItemLocationDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStItemLocation",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StItemLocationId").append("<option selected='selected' value='" + result.id + "'>" + result.locationNameAr + "</option>");
                $("#closeStItemLocationModal").click();

            }
        });
    }

});
$("#closeStItemLocationModal").on('click', function () {

    $("#LocationNameAr").val('');
    $("#LocationNameEn").val('');
    $("#StItemLocationDescriptionModal").val('');

});
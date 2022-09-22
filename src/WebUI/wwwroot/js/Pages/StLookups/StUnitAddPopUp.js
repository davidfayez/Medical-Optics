
$("#submitStUnitModal").on('click', function () {
    debugger;

    if ($("#StUnitModal").valid()) {

        var data = {
            UnitNameAr: $("#UnitNameAr").val(),
            UnitNameEn: $("#UnitNameEn").val(),
            Description: $("#StUnitDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStUnit",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StUnitId").append("<option selected='selected' value='" + result.id + "'>" + result.unitNameAr + "</option>");
                $("#closeStUnitModal").click();

            }
        });
    }

});
$("#closeStUnitModal").on('click', function () {

    $("#UnitNameAr").val('');
    $("#UnitNameEn").val('');
    $("#StUnitDescriptionModal").val('');

});
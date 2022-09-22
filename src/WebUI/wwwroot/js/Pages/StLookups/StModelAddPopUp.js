
$("#submitStModelModal").on('click', function () {
    debugger;

    if ($("#StModelModal").valid()) {

        var data = {
            ModelNameAr: $("#ModelNameAr").val(),
            ModelNameEn: $("#ModelNameEn").val(),
            Description: $("#StModelDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStModel",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StModelId").append("<option selected='selected' value='" + result.id + "'>" + result.modelNameAr + "</option>");
                $("#closeStModelModal").click();

            }
        });
    }

});
$("#closeStModelModal").on('click', function () {

    $("#ModelNameAr").val('');
    $("#ModelNameEn").val('');
    $("#StModelDescriptionModal").val('');

});

$("#submitStTypeModal").on('click', function () {
    debugger;

    if ($("#StTypeModal").valid()) {

        var data = {
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            Description: $("#StTypeDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStType",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#closeStTypeModal").click();

            }
        });
    }

});
$("#closeStTypeModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#StTypeDescriptionModal").val('');

});
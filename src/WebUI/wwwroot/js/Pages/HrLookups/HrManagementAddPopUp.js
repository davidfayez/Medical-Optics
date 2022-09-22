
$("#submitManagementModal").on('click', function () {
    debugger;

    if ($("#ManagementModal").valid()) {

        var data = {
            ManagementNameAr: $("#ManagementNameAr").val(),
            ManagementNameEn: $("#ManagementNameEn").val(),
            Description: $("#ManagementDescriptionModal").val(),
        }

        $.ajax({
            url: "/HrLookups/PopUpCreateHrManagement",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_HrManagementId").append("<option selected='selected' value='" + result.id + "'>" + result.managementNameAr + "</option>");
                $("#closeManagementModal").click();

            }
        });
    }

});
$("#closeManagementModal").on('click', function () {

    $("#ManagementNameAr").val('');
    $("#ManagementNameEn").val('');
    $("#ManagementDescriptionModal").val('');

});
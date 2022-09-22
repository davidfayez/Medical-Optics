$("#submitFrezzingReasonModal").on('click', function () {
    debugger;

    if ($("#frezzingReasonModal").valid()) {

        var data = {
            ReasonTextAr: $("#ReasonTextAr").val(),
            ReasonTextEn: $("#ReasonTextEn").val(),
            Notes: $("#Notes").val(),
            SecModule: $("#hdnModule").val(),
            SecModulePage: $("#hdnModulePage").val(),
        }

        $.ajax({
            url: "/DefFreezingReason/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_DefFreezingReasonId").append("<option selected='selected' value='" + result.id + "'>" + result.reasonTextAr + "</option>");
                $("#closeFrezzingReasonModal").click();

            }
        });
    }

});
$("#closeFrezzingReasonModal").on('click', function () {
    debugger;
    $("#ReasonCode").val('');
    $("#ReasonTextAr").val('');
    $("#ReasonTextEn").val('');
    $("#Notes").val('');

});
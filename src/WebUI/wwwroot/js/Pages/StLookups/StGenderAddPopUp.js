
$("#submitStGenderModal").on('click', function () {
    debugger;

    if ($("#StGenderModal").valid()) {

        var data = {
            GenderNameAr: $("#GenderNameAr").val(),
            GenderNameEn: $("#GenderNameEn").val(),
            Description: $("#StGenderDescriptionModal").val(),
        }

        $.ajax({
            url: "/StLookups/PopUpCreateStGender",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_StGenderId").append("<option selected='selected' value='" + result.id + "'>" + result.genderNameAr + "</option>");
                $("#closeStGenderModal").click();

            }
        });
    }

});
$("#closeStGenderModal").on('click', function () {

    $("#GenderNameAr").val('');
    $("#GenderNameEn").val('');
    $("#StGenderDescriptionModal").val('');

});
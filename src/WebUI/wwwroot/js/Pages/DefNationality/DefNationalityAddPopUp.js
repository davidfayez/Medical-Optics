
$("#submitDefNationalityModal").on('click', function () {
    debugger;

    if ($("#DefNationalityModal").valid()) {

        var data = {
            NationalityNameAr: $("#NationalityNameAr").val(),
            NationalityNameEn: $("#NationalityNameEn").val(),
            Description: $("#DefNationalityDescriptionModal").val(),
        }

        $.ajax({
            url: "/DefNationality/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_DefNationalityId").append("<option selected='selected' value='" + result.id + "'>" + result.NationalityNameAr + "</option>");
                
                $("#FK_NationalityId").data("kendoDropDownList").dataSource.read();
                $("#FK_NationalityId").data("kendoDropDownList").value(result.id);
                $("#closeDefNationalityModal").click();

            }
        });
    }

});
$("#closeDefNationalityModal").on('click', function () {

    $("#NationalityNameAr").val('');
    $("#NationalityNameEn").val('');
    $("#DefNationalityDescriptionModal").val('');

});
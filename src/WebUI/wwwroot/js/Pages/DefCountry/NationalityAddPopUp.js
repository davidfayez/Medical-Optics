
$("#submitNationalityModal").on('click', function () {

    if ($("#NationalityModal").valid()) {

        var data = {
            NationalityNameAr: $("#NationalityNameAr").val(),
            NationalityNameEn: $("#NationalityNameEn").val(),
            //NationalityNameAr:  $("#NationalityNameAr").val(),
            //CNationalityNameEn: $("#CNationalityNameEn").val(),
            Description: $("#NationalityDescriptionModal").val(),
        }

        $.ajax({
            url: "/DefNationality/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //  $("#FK_NationalityId").append("<option selected='selected' value='" + result.id + "'>" + result.nationalityNameAr + "</option>");

                $("#FK_NationalityId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.nationalityCode + " " + result.nationalityNameAr });
                $("#FK_NationalityId").data("kendoDropDownList").value(result.id);
                $("#closeNationalityModal").click();



            }
        });
    }

});
$("#closeNationalityModal").on('click', function () {

    $("#NationalityNameAr").val('');
    $("#NationalityNameEn").val('');
    $("#NationalityDescriptionModal").val('');
    //$("#NationalityNameAr").val('');
    //$("#CNationalityNameEn").val('');
});

$("#submitCityModal").on('click', function () {


    if ($("#CityModal").valid()) {

        var data = {
            CityNameAr: $("#CityNameAr").val(),
            CityNameEn: $("#CityNameEn").val(),
            GovernorateNameAr: $("#GovernorateNameAr").val(),
            GovernorateNameEn: $("#GovernorateNameEn").val(),
            Description: $("#cityDescriptionModal").val(),
            FK_DefCountryId: parseInt($("#fk_defCountryCityId").val())
        }

        $.ajax({
            url: "/DefCity/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //   $("#FK_DefCityId").append("<option selected='selected' value='" + result.id + "'>" + result.cityNameAr + "</option>");

                $("#FK_DefCityId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.cityCode + " " + result.cityNameAr });
                $("#FK_DefCityId").data("kendoDropDownList").value(result.id);
                $("#closeCityModal").click();

            }
        });
    }

});
$("#closeCityModal").on('click', function () {

    $("#CityNameAr").val('');
    $("#CityNameEn").val('');
    $("#GovernorateNameAr").val('');
    $("#GovernorateNameEn").val('');
    $("#cityDescriptionModal").val('');

});
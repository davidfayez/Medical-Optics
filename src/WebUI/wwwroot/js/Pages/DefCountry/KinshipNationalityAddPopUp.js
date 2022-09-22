
$("#submitKinshipNationalityModal").on('click', function () {
    debugger;

    if ($("#KinshipNationalityModal").valid()) {

        var data = {
            NationalityNameAr: $("#KinshipNationalityNameAr").val(),
            NationalityNameEn: $("#KinshipNationalityNameEn").val(),
            //CapitalNameAr:  $("#CapitalNameAr").val(),
            //CapitalNameEn: $("#CapitalNameEn").val(),
            Description: $("#KinshipNationalityDescriptionModal").val(),
        }

        $.ajax({
            url: "/DefNationality/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
              //  $("#FK_KinshipNationalityId").append("<option selected='selected' value='" + result.id + "'>" + result.nationalityNameAr + "</option>");

                $("#FK_KinshipNationalityId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.nationalityCode + " " + result.nationalityNameAr });
                $("#FK_KinshipNationalityId").data("kendoDropDownList").value(result.id);
                $("#closeKinshipNationalityModal").click();

            }
        });
    }

});
$("#closeKinshipNationalityModal").on('click', function () {

    $("#KinshipNationalityNameAr").val('');
    $("#KinshipNationalityNameEn").val('');
    $("#KinshipNationalityDescriptionModal").val('');
    //$("#CapitalNameAr").val('');
    //$("#CapitalNameEn").val('');
});
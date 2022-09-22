
$("#submitDefReligionModal").on('click', function () {
    debugger;

    if ($("#DefReligionModal").valid()) {

        var data = {
            ReligionNameAr: $("#ReligionNameAr").val(),
            ReligionNameEn: $("#ReligionNameEn").val(),
            Description: $("#DefReligionDescriptionModal").val(),
        }

        $.ajax({
            url: "/DefReligion/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_DefReligionId").append("<option selected='selected' value='" + result.id + "'>" + result.religionNameAr + "</option>");

                $("#FK_DefReligionId").data("kendoDropDownList").dataSource.add({ id: result.id, nameAndCode: result.religionCode + " " + result.religionNameAr });
                $("#FK_DefReligionId").data("kendoDropDownList").value(result.id);
                $("#closeDefReligionModal").click();

            }
        });
    }

});
$("#closeDefReligionModal").on('click', function () {

    $("#TypeNameAr").val('');
    $("#TypeNameEn").val('');
    $("#DefReligionDescriptionModal").val('');

});
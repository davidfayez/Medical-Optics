
$("#submitDefBranchModal").on('click', function () {
    debugger;

    if ($("#DefBranchModal").valid()) {

        var data = {
            BranchCode: $("#BranchCode").val(),
            BranchNameAr: $("#BranchNameAr").val(),
            BranchNameEn: $("#BranchNameEn").val(),
            BranchAddress: $("#BranchAddress").val(),
            FK_DefCompanyId: parseInt($("#FK_DefCompanyId").val()),
            FK_DefCountryId: parseInt($("#FK_DefCountryId").val()),
            FK_DefCityId: parseInt($("#FK_DefCityId").val()),

        }

        $.ajax({
            url: "/DefBranch/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_DefBranchId").append("<option selected='selected' value='" + result.id + "'>" + result.branchNameAr + "</option>");
                $("#closeDefBranchModal").click();

            }
        });
    }

});
$("#closeDefBranchModal").on('click', function () {

    $("#BranchCode").val('');
    $("#BranchNameAr").val('');
    $("#BranchNameEn").val('');

    $("#BranchAddress").val('');
    $("#FK_DefCompanyId").val('');
    $("#FK_DefCountryId").val('');
    $("#FK_DefCityId").val('');

});
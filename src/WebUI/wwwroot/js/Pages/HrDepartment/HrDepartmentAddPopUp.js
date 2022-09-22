
$("#submitDepartmentModal").on('click', function () {
    debugger;

    if ($("#DepartmentModal").valid()) {

        var data = {
            DepartmentNameAr: $("#DepartmentNameAr").val(),
            DepartmentNameEn: $("#DepartmentNameEn").val(),
            Description: $("#DepartmentDescriptionModal").val(),
        }

        $.ajax({
            url: "/HrDepartment/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_HrDepartmentId").append("<option selected='selected' value='" + result.id + "'>" + result.departmentNameAr + "</option>");
                $("#closeDepartmentModal").click();

            }
        });
    }

});
$("#closeDepartmentModal").on('click', function () {

    $("#DepartmentNameAr").val('');
    $("#DepartmentNameEn").val('');
    $("#DepartmentDescriptionModal").val('');

});
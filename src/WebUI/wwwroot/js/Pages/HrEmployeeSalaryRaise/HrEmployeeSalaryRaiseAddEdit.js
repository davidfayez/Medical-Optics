$(document).ready(function () {

    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());
    if (EmployeeId > 0) {
        
        $.ajax({
            url: "/HrEmployeeVacation/GetCardData?id=" + EmployeeId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
                var TodayDate = new Date();
                var month = TodayDate.getMonth();
                var year = TodayDate.getFullYear();
                var daysCount = new Date(year, month + 1, 0).getDate();
                var payPerDay = (data.basicSalary + data.totalAllowance) / daysCount;
                var payPerHour = payPerDay / data.hoursCount;
                $("#BasicSalary").val(data.basicSalary);
                $("#TotalAllowance").val(data.totalAllowance);
                $("#HoursCount").val(data.hoursCount);
                $("#PayPerDay").val(payPerDay);
                $("#PayPerHour").val(payPerHour);
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

            }
        });
    }

    $("#FK_HrAllowanceTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllAllowanceTypeForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        }
    });



    $("#btnSubmit").on('click', function () {

        if ($("#FK_HrEmployeeId").val() == 0)
            $("#employeeIdValidation").show();
        else
            $("#employeeIdValidation").hide();

        if ($("#FK_HrAllowanceTypeId").val() == 0)
            $("#FK_HrAllowanceTypeIdValidation").show();
        else
            $("#FK_HrAllowanceTypeIdValidation").hide();

        if ($("#Amount").val() == 0)
            $("#AmountValidation").show();
        else
            $("#AmountValidation").hide();

        if ($("#mainForm").valid() && $("#FK_HrEmployeeId").val() > 0 && $("#FK_HrAllowanceTypeId").val() > 0 && $("#Amount").val() > 0) {
            $("#mainForm").submit();
        }
    });

});
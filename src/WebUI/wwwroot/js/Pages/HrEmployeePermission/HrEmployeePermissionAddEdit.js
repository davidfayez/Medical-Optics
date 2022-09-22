$(document).ready(function () {


    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);



    });
    $("#FK_HrManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrManagementForDDList",
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
        },
        select: onSelectManagement
    });
    function onSelectManagement(e) {
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

    }
    $("#FK_HrDepartmentId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrDepartment/GetAllForDDList",
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
        },
        select: onSelectDepartment
    });
    function onSelectDepartment(e) {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

    }
    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

                    var managementId = parseInt($("#FK_HrManagementId").val()),
                        departmentId = parseInt($("#FK_HrDepartmentId").val());
                    if (managementId == 0 || isNaN(managementId))
                        managementId = null;
                    if (departmentId == 0 || isNaN(departmentId))
                        departmentId = null;


                    if (data.hasOwnProperty.length > 0 && data.managementId > 0 && data.managementId != undefined)
                        managementId = data.managementId;
                    else if (data.managementId == 0)
                        managementId = null;


                    if (data.hasOwnProperty.length > 0 && data.departmentId > 0 && data.departmentId != undefined)
                        departmentId = data.departmentId;
                    else if (data.departmentId == 0)
                        departmentId = null;

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onEmpSelect
    });
    function onEmpSelect(e) {

        $("#FK_HrEmployeeId").val(e.dataItem.id);
        // $("#employeeName").val(e.dataItem.fullName);
        if (e.dataItem.id > 0) {
            $.ajax({
                url: "/HrEmployeeVacation/GetCardData?id=" + e.dataItem.id,
                type: "Get",
                contentType: false,
                processData: false,
                success: function (data) {

                    var TodayDate = new Date();
                    var month = TodayDate.getMonth();
                    var year = TodayDate.getFullYear();
                    var daysCount = new Date(year, month + 1, 0).getDate();
                    var payPerDay = Number((data.basicSalary + data.totalAllowance) / daysCount).toFixed(2);
                    var payPerHour = data.hoursCount == 0 ? 0 : Number(payPerDay / data.hoursCount).toFixed(2);
                    $("#BasicSalary").val(data.basicSalary);
                    $("#TotalAllowance").val(data.totalAllowance);
                    $("#HoursCount").val(data.hoursCount);
                    $("#PayPerDay").val(payPerDay);
                    $("#PayPerHour").val(payPerHour);
                    $("#userImage").attr("src", data.imagePath);

                }
            });
        }



    }

    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());
    if (EmployeeId > 0) {
        debugger
        if ($("#IsDeductedFromSalary").val() == "True") {
            $('#Amount').removeAttr("disabled");
            $('#IsPercentage').removeAttr("disabled");
            $("#checkboxIsDeducted").prop("checked", true);
        }

        $.ajax({
            url: "/HrEmployeeVacation/GetCardData?id=" + EmployeeId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                var TodayDate = new Date();
                var month = TodayDate.getMonth();
                var year = TodayDate.getFullYear();
                var daysCount = new Date(year, month + 1, 0).getDate();
                var payPerDay = Number((data.basicSalary + data.totalAllowance) / daysCount).toFixed(2);
                var payPerHour = data.hoursCount == 0 ? 0 : Number(payPerDay / data.hoursCount).toFixed(2);
                $("#BasicSalary").val(data.basicSalary);
                $("#TotalAllowance").val(data.totalAllowance);
                $("#HoursCount").val(data.hoursCount);
                $("#PayPerDay").val(payPerDay);
                $("#PayPerHour").val(payPerHour);
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

            }
        });
    }

    $('#checkboxIsDeducted').click(function () {

        if ($(this).is(':checked')) {
            $('#Amount').removeAttr("disabled");
            $('#IsPercentage').removeAttr("disabled");
            $('#IsDeductedFromSalary').val(true);
        } else {
            $("#Amount").attr("disabled", "disabled");
            $("#IsPercentage").attr("disabled", "disabled");
            $('#Amount').val(null);
            $('#IsDeductedFromSalary').val(false);
        }
    });

    $("#Amount").keyup(function () {
        debugger
        var isPercentage = $("#IsPercentage").val();
        var salary = parseFloat($("#BasicSalary").val());
        var amount = parseFloat($(this).val());
        var totalAmount = null;
        if (isPercentage == "True" && salary > 0) {
            totalAmount = (salary * amount) / 100;
        } else {
            totalAmount = amount;
        }

        $('#TotalDeductedAmount').val(parseFloat(totalAmount));
    });

    $("#IsPercentage").change(function () {
        $('#Amount').val(null);
        $('#TotalDeductedAmount').val(null);
    });

    $("#DateOfPermission").on('change', function () {
        debugger;
        var DateOfPermission = new Date($("#DateOfPermission").val());
        var month = DateOfPermission.getMonth();
        var year = DateOfPermission.getFullYear();
        var basicSalary = parseFloat($("#BasicSalary").val());
        var totalAllowance = parseFloat($("#TotalAllowance").val());
        var hoursCount = parseInt($("#HoursCount").val());
        var daysCount = new Date(year, month + 1, 0).getDate();
        var payPerDay = (basicSalary + totalAllowance) / daysCount;
        var payPerHour = payPerDay / hoursCount;
        $("#BasicSalary").val(basicSalary);
        $("#TotalAllowance").val(totalAllowance);
        $("#PayPerDay").val(payPerDay);
        $("#PayPerHour").val(payPerHour);
    });
    $("#btnSubmit").on('click', function () {

        if ($("#FK_HrEmployeeId").val() == 0)
            $("#employeeIdValidation").show();
        else
            $("#employeeIdValidation").hide();

        debugger
        if ($("#mainForm").valid() && $("#FK_HrEmployeeId").val() > 0) {
            $("#mainForm").submit();
        }
    });


});
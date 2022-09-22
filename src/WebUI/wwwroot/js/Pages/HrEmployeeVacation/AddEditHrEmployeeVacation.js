$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_AlternativeEmployee").data("kendoDropDownList").dataSource.read();
        $("#FK_AlternativeEmployee").data("kendoDropDownList").value(0);

        $("#FK_AlternativeToPayingAnyDue").data("kendoDropDownList").dataSource.read();
        $("#FK_AlternativeToPayingAnyDue").data("kendoDropDownList").value(0);


        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);

        $("#FK_HrVacationTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrVacationTypeId").data("kendoDropDownList").value(0);


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
        $("#FK_AlternativeEmployee").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_AlternativeToPayingAnyDue").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#FK_AlternativeEmployee").data("kendoDropDownList").value(0);
        $("#FK_AlternativeToPayingAnyDue").data("kendoDropDownList").value(0);

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
        $("#FK_AlternativeEmployee").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_AlternativeToPayingAnyDue").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#FK_AlternativeEmployee").data("kendoDropDownList").value(0);
        $("#FK_AlternativeToPayingAnyDue").data("kendoDropDownList").value(0);

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

    $("#FK_HrVacationTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrVacationTypeForDDList",
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

    });

    $("#FK_AlternativeEmployee").kendoDropDownList({
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
        }

    });
    $("#FK_AlternativeToPayingAnyDue").kendoDropDownList({
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
        }

    });

    //In Edit Get Card Data
    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());
    if (EmployeeId > 0) {
        $.ajax({
            url: "/HrEmployeeVacation/GetCardData?id=" + EmployeeId,
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


    $("#DateFrom").on('change', function () {

        var DateFrom = new Date($("#DateFrom").val());
        var month = DateFrom.getMonth();
        var year = DateFrom.getFullYear();
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

        if ($("#FK_AlternativeEmployee").val() == 0)
            $("#alternativeEmployeeIdValidation").show();
        else
            $("#alternativeEmployeeIdValidation").hide();

        if ($("#FK_HrVacationTypeId").val() == 0)
            $("#vacationTypeIdValidation").show();
        else
            $("#vacationTypeIdValidation").hide();

        if ($("#mainForm").valid() && $("#FK_HrEmployeeId").val() > 0 && $("#FK_HrVacationTypeId").val() > 0 && $("#FK_AlternativeEmployee").val() > 0) {
            $("#mainForm").submit();
        }
    });
});
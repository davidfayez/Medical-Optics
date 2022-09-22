$(document).ready(function () {

    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#DateFrom').val(today);
    $('#DateTo').val(today);

    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#employeeFirstRangeAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#employeeFirstRangeAutoComplete").data("kendoDropDownList").value(0);

        $("#employeeSecondRangeAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#employeeSecondRangeAutoComplete").data("kendoDropDownList").value(0);

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



    $("#costCenterAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectCostCenter
    });

    function onSelectCostCenter(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }

    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
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
    });

});

$("#btnDataReview").on('click', function () {
    var fK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
        fK_CostCenterId = parseInt($("#FK_CostCenterId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    $('.exportExcel').fadeIn('slow');
    //$('#GridSalariesThroughBanks').data('kendoGrid').dataSource.read({ fK_HrEmployeeId: fK_HrEmployeeId, fK_CostCenterId: fK_CostCenterId, dateFrom: dateFrom, dateTo: dateTo, ids: ids });
    $.ajax({
        url: "/HrReports/GetSalaryEmployeeThroughMonth?fK_HrEmployeeId=" + fK_HrEmployeeId + "&fK_CostCenterId=" + fK_CostCenterId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_DefBranchId=" + fK_DefBranchId,
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {
            debugger;
            $("#EmployeeCode").val(data.employeeCode);
            $("#EmployeeName").val(data.employeeName);
            $("#CostCenterNameEmployeeData").val(data.costCenterName);

            $("#WorkDayCount").val(data.workDayCount);
            $("#BasicSalary").val(data.basicSalary);
            $("#HousingAllowance").val(data.housingAllowance);
            $("#OtherDues").val(data.otherDues);
            $("#VariableAllowances").val(data.variableAllowances);

            $("#OvertimeHourCount").val(data.overtimeHourCount);
            $("#OvertimeValue").val(data.overtimeValue);
            $("#Bouns").val(data.bounsValue);
            $("#TotalOvertimesAndBonus").val(data.totalOvertimesAndBonus);

            $("#BasicSalaryForDeductions").val(data.basicSalary);
            $("#OvertimeValueForDeductions").val(data.overtimeValue);
            $("#TotalAllowances").val(data.totalAllowances);
            $("#Deductions").val(data.totalDeductions);
            $("#TotalDues").val(data.totalDues);
        }
    });
});


$(".btnPrint").on('click', function () {
    debugger;
    var fK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
        fK_CostCenterId = parseInt($("#FK_CostCenterId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var url = "/HrReports/SalaryEmployeeThroughMonthPrint?fK_HrEmployeeId=" + fK_HrEmployeeId + "&fK_CostCenterId=" + fK_CostCenterId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_DefBranchId=" + fK_DefBranchId;
    window.open(url, '_blank');
});
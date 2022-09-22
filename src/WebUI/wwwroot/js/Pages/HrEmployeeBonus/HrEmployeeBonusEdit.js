$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_GranterId").data("kendoDropDownList").dataSource.read();
        $("#FK_GranterId").data("kendoDropDownList").value(0);


        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);

        $("#FK_HrBonusTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrBonusTypeId").data("kendoDropDownList").value(0);


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
    $("#FK_HrBonusTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllBonusTypeForDDList",
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
    //In Edit Get Card Data
    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());

    if (EmployeeId > 0) {
        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + EmployeeId,
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
        $("#employeeName").val(e.dataItem.fullName);
        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + e.dataItem.id,
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
    $("#FK_GranterId").kendoDropDownList({
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
    $("#Count").change(function () {
        calculateAmount();
    })
})

function calculateAmount() {
    var calcMetod = $('input[name="CalculationMethod"]:checked').val();
    var count = $("#Count").val(),
        perday = $("#PayPerDay").val(),
        perHour = $("#PayPerHour").val(),
        basic = $("#BasicSalary").val();
    if (count > 0 && perday > 0 && perHour > 0 && basic > 0) {
        if (calcMetod == 1) {

            $("#Amount").val(perday * count);
        } else if (calcMetod == 2) {
            $("#Amount").val(perHour * count);
        } else if (calcMetod == 3) {

            $("#Amount").val((count / 100) * basic);
        } else {
            $("#Amount").val(count);
        }
    } else {
        $("#Amount").val("");
    }



}

function removeEmployeeBonus(id) {

    swal({
        title: Resources.DeleteResource,
        text: Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/HrEmployeeBonus/Delete?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        document.location = "../../HrEmployeeBonus/Index";
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}

$("#btnSubmit").on('click', function () {

    if ($("#FK_HrEmployeeId").val() == 0)
        $("#employeeIdValidation").show();
    else
        $("#employeeIdValidation").hide();

    if ($("#FK_HrBonusTypeId").val() == 0)
        $("#FK_HrBonusTypeIdValidation").show();
    else
        $("#FK_HrBonusTypeIdValidation").hide();

    if ($("#FK_GranterId").val() == 0)
        $("#FK_GranterIdValidation").show();
    else
        $("#FK_GranterIdValidation").hide();

    if ($("#formEmployeeBonus").valid() && $("#FK_HrEmployeeId").val() > 0 && $("#FK_HrBonusTypeId").val() > 0 && $("#FK_GranterId").val() > 0) {
        $("#formEmployeeBonus").submit();
    }
});
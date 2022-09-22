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
    //In Edit Get Card Data
    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());
    if (EmployeeId > 0) {
        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + EmployeeId,
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
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

            }
        });
    }


    function onEmpSelect(e) {

        $("#FK_HrEmployeeId").val(e.dataItem.id);

        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + e.dataItem.id,
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
                $("#empCode").val(data.empCode);
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);
    
                if (data.empCode != "") {
                    loadAllAttendance(data.empCode);
                }
            }
        });

    }

    getDate();
    function getDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + '-' + mm + '-' + dd;
        $("#attendDate").val(today);
    }



    $("#Count").change(function () {
        calculateAmount();
    });


    loadAllAttendance("");
    function loadAllAttendance(code) {

        var gridattend = $("#attendancegrid").kendoGrid({
            dataSource: {
                transport: {
                    read: "/HrEmployeeAttendance/GetEmployeeHours?code=" + code + "&&date=" + $("#attendDate").val()
                }, schema: {
                    model: {
                        id: "id",
                        fields: {
                            attendDate: { type: "date" },
                            dayName: { type: "string" },
                            overTimeHours: { type: "string" },
                            lateHours: { type: "string" },
                            workingHours: { type: "string" },
                        }
                    }
                }
            },
            height: 400,
            scrollable: true,
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            resizable: true,
            //filterable: true,
            //columnMenu: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            //pageable: true,
            columns: [
                {
                    field: "dayName",
                    title: Resources.Day,
                    width: Resources.CodeWidth
                },
                {
                    field: "attendDate",
                    title: Resources.Date,
                    format: "{0:yyyy/MM/dd }",
                    width: Resources.DateWidth
                },
                {
                    field: "workingHours",
                    title: Resources.WorkingHours,
                    format: "{0: hh:mm tt}",
                    width: Resources.CodeWidth
                },
                {
                    field: "overTimeHours",
                    title: Resources.Overtime,
                    format: "{0: hh:mm tt}",
                    width: Resources.CodeWidth
                },

                {
                    field: "lateHours",
                    title: Resources.Delay,
                    format: "{0: hh:mm tt}",
                    width: Resources.CodeWidth
                }



            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    //kendo.bind(this, dataItem);

                });


            }
        });

    }

    $("#saveAttendbtn").click(function () {
        var grid = $("#attendancegrid").data("kendoGrid").dataSource.data();

        if (grid.length > 0) {
            var attend = [];
            for (var i = 0; i < grid.length; i++) {
                if (grid[i].id == 0) {
                    if (grid[i].attendType == 0)
                        grid[i].attendType = 3;
                    var rowDate = grid[i].attendDate;
                    var row = {
                        FK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                        AttendType: grid[i].attendType,
                        AttendDate: rowDate.getDate() + "-" + (rowDate.getMonth() + 1) + "-" + rowDate.getFullYear(),//grid[i].attendDate
                        FK_DefBranchId: parseInt($("#FK_DefBranchId").val())
                    };
                    attend.push(row);
                }
            }

            $.ajax({
                url: '/HrEmployeeAttendance/ApproveAttendance',
                type: "POST",
                data: { attendanceVMs: attend },
                success: function (result) {
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                }
            })
        } else {
            swal({
                title: Resources.EmployeeCodeNotFoundResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    })

    $("#attendDate").change(function () {
        loadAllAttendance($("#employeeAutoComplete").val());
    })
})









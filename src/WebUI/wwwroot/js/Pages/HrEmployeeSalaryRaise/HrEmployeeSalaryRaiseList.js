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

    loadGridSalaryRaise();

    function loadGridSalaryRaise() {
        $("#EmployeeCode").val("");
        $("#EmployeeName").val("");
        $("#EmployeeJob").val("");
        $("#HireDate").val("");
        $("#BasicSalaryData").val(0);
        $("#EmployeeCurrentSalary").val(0);
        $("#Reward").val(0);
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeSalaryRaise/GetAll/" + $("#FK_HrEmployeeId").val(),
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: Resources.GridPageSize,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        allowanceDate: { type: "date",editable: false },
                        amount: { editable: false },
                        allowanceTypeName: { editable: false },
                        creationDate: { type: "date", editable: false },
                    }
                }
            }
        });


        var grid = $("#GridSalaryRaise").kendoGrid({
            excel: {
                fileName: "Permissions.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable
            ,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                {
                    field: "allowanceDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                },

                { field: "amount", title: Resources.Amount, width: Resources.CodeWidth },
                { field: "allowanceTypeName", title: Resources.AllowanceType, width: Resources.CodeWidth },
                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeSalaryRaise/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> #if(isDeleted==false){#<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>#}else{# <a  style='background-color:lightgreen!important' class='btn btn-sm btnRetrieve' ><i class='fas fa-reply'></i></a> #}#"
                },


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                })
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAllowance);
    }

    function removeAllowance() {

        var row = $(this).closest("tr"),
            grid = $("#GridSalaryRaise").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
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
                    url: "/HrEmployeeSalaryRaise/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadGridSalaryRaise();
                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
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

    $("#btnSearch").on('click', function () {
        loadGridSalaryRaise();
        $.ajax({
            url: "/HrEmployeeSalaryRaise/GetEmployeeRaiseData?id=" + $("#FK_HrEmployeeId").val(),
            success: function (data) {
                $("#EmployeeCode").val(data.employeeCode);
                $("#EmployeeName").val(data.employeeName);
                $("#EmployeeJob").val(data.jobName);
                var hireDate = new Date(data.hireDate)
                if (data.hireDate != null)
                    $("#HireDate").val(hireDate.toLocaleDateString());
                $("#BasicSalaryData").val(data.basicAmount);
                $("#EmployeeCurrentSalary").val(data.currentSalary);
                $("#Reward").val(data.totalAllowance);
            }
        })
    });


    $("#createLink").click(function () {
        if ($("#FK_HrEmployeeId").val()>0) {
            window.location = "/HrEmployeeSalaryRaise/Create/" + $("#FK_HrEmployeeId").val();
        } else {
            swal({
                title: Resources.ChooseEmployee,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    })

    $("#submitSalaryRaiseModal").click(function () {
        if ($("#FK_HrEmployeeId").val() == 0) {
            swal({
                title: Resources.ChooseEmployee,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        var basicAmount = $("#BasicAmount").val(),
            totalAllowance = $("#TotalAllowanceInput").val();
        if (basicAmount > 0)
            $("#BasicAmountValidation").hide();
        else
            $("#BasicAmountValidation").show();

        if (totalAllowance> 0)
            $("#TotalAllowanceValidation").hide();
        else
            $("#TotalAllowanceValidation").show();

        if (basicAmount > 0 && totalAllowance > 0 && $("#FK_HrEmployeeId").val() > 0) {
            var data = {
                BasicAmount: basicAmount,
                FK_DefBranchId: $("#FK_DefBranchId").val(),
                FK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                RaiseDate: $("#RaiseDate").val(),
                TotalAllowance: totalAllowance
            }
            $.ajax({
                url: "/HrEmployeeSalaryRaise/CreateSalaryRaise",
                type: "POST",
                data: { salaryRaiseVM: data },
                success: function () {
                    $("#EmployeeCurrentSalary").val(basicAmount);
                    $("#Reward").val(totalAllowance);
                    $("#TotalAllowanceInput").val(0)
                    $("#BasicAmount").val(0)
                    $("#salaryRaise").modal('toggle');
                }
            })
        }
        



    })

    if ($("#FK_HrEmployeeId").val() > 0) {
        $.ajax({
            url: "/HrEmployeeVacation/GetCardData?id=" + $("#FK_HrEmployeeId").val(),
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {

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
                $("#userImage").attr("src", data.imagePath);

            }
        });
        $.ajax({
            url: "/HrEmployeeSalaryRaise/GetEmployeeRaiseData?id=" + $("#FK_HrEmployeeId").val(),
            success: function (data) {
                $("#EmployeeCode").val(data.employeeCode);
                $("#EmployeeName").val(data.employeeName);
                $("#EmployeeJob").val(data.jobName);
                var hireDate = new Date(data.hireDate)
                $("#HireDate").val(hireDate.toLocaleDateString());
                $("#BasicSalaryData").val(data.basicAmount);
                $("#EmployeeCurrentSalary").val(data.currentSalary);
                $("#Reward").val(data.totalAllowance);
            }
        })
        loadGridSalaryRaise();
    }
});

$(".exportExcel").on('click', function () {

    $("#GridSalaryRaise").getKendoGrid().saveAsExcel();
});
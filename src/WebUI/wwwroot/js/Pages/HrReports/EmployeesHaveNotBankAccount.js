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

    $("#employeeFirstRangeAutoComplete").kendoDropDownList({
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
        select: onSelectFirstEmployee
    });

    function onSelectFirstEmployee(e) {

        $("#FirstCode").val(e.dataItem.code);
    }

    $("#employeeSecondRangeAutoComplete").kendoDropDownList({
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
        select: onSelectSecondEmployee
    });

    function onSelectSecondEmployee(e) {

        $("#SecondCode").val(e.dataItem.code);
    }

    //Grid Salaries
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/HrReports/GetEmployeeHaveNoBankAccount",
                traditional: true,
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 10,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    employeeCode: { editable: false },
                    employeeName: { editable: false },
                    idNumber: { editable: false },
                    costCenterName: { type: "string" },
                    basicSalary: { editable: false },
                    overtimeValue: { editable: false },
                    totalSalary: { editable: false },
                    housingAllowance: { editable: false },
                    otherDues: { editable: false },
                    loanValue: { editable: false },
                }
            }
        }
    });
    $("#GridSalariesThroughBanks").kendoGrid({
        excel: {
            fileName: "Purchases Movements.xlsx",
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
            pageSizes: [10, 20, 50, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [
            { field: "employeeCode", title: Resources.EmployeeCode, width: Resources.CodeWidth },
            { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
            { field: "idNumber", title: Resources.IDNumber, width: Resources.NameWidth },
            { field: "costCenterName", title: Resources.CostCenterName, width: Resources.NameWidth },
            { field: "basicSalary", title: Resources.BasicSalary, width: Resources.AmountWidth },
            { field: "overtimeValue", hidden: true, title: Resources.OvertimeValue, width: Resources.AmountWidth },
            { field: "totalSalary", title: Resources.TotalSalary, width: Resources.AmountWidth },
            { field: "housingAllowance", title: Resources.HousingAllowance, width: Resources.AmountWidth },
            { field: "otherDues", title: Resources.OtherDues, width: Resources.AmountWidth },
            { field: "loanValue", title: Resources.LoanValue, width: Resources.AmountWidth },
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isActive) {
                    //$(this).addClass("k-state-selected");
                }
            });
        },
    });

    //fill multi select data 
    function GetMultiSelectDataSource() {
        multiSelectSource = new kendo.data.DataSource({
            serverFiltering: true,
            type: "json",
            transport: {
                read: {
                    url: "/HrEmployee/GetAllBetweenTwoCode"
                },
                parameterMap: function (data, action) {
                    if (action === "read") {
                        return {
                            firstCode: $("#FirstCode").val(),
                            secondCode: $("#SecondCode").val(),
                        };
                    } else {
                        return data;
                    }
                }
            }
            ,
            schema: {
                model: {
                    id: "id",
                    fields: {

                        fullName: {
                            type: "string"
                        },
                        code: {
                            type: "string"
                        }
                    }
                }
            }
        });
        var multiselect = $("#multiselect").data("kendoMultiSelect");
        multiselect.setDataSource(multiSelectSource);

    }
    //Grid Exception Employee
    var exceptionSource = new kendo.data.DataSource({

    });
    var gridException = $("#GridException").kendoGrid({
        dataSource: exceptionSource,
        navigatable: true,
        pageable: false,
        columns: [
            { field: "id", hidden: true, format: "{0:c}" },
            { field: "employeeCode", title: Resources.EmployeeCode, width: Resources.CodeWidth },
            { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

        ],
        editable: false,
        selectable: "multiple, cell",
        noRecords: true,
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        messages: {
            noRecords: "There is no data on current page"
        },

    });
    gridException.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeRow);

    // Remove row from Exception grid
    function removeEmployeeRow() {
        debugger;

        var row = $(this).closest("tr"),
            grid = $("#GridException").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#GridException").data("kendoGrid").dataSource;
                if (dataSource.remove(dataItem)) {
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
            }, 1000);
        });
    }

    $("#btnAddExceptions").on('click', function () {
        debugger;
        var multiselect = $("#multiselect").data("kendoMultiSelect");
        var multiDataItems = multiselect.dataItems();
        var gridExceptionsData = $('#GridException').data("kendoGrid").dataSource.data();
        var totalRecords = $("#GridException").data("kendoGrid").dataSource.data().length;

        //var intersection = gridExceptionsData.filter(x => multiDataItems.includes(x));
        for (var i = 0; i < multiDataItems.length; i++) { // check this infinity looooooooooop ya daved !
            var currentEmployee = multiDataItems[i];
            var x = true;
            if (gridExceptionsData.length > 0) {
                for (var j = 0; j < gridExceptionsData.length; j++) {
                    //gridExceptionsData = $('#GridException').data("kendoGrid").dataSource.data();
                    if (currentEmployee.id == gridExceptionsData[j].id) {
                        x = false;
                        break;
                    }

                }
                if (x == true) {
                    //else if (currentEmployee.id != gridExceptionsData[j].id) {
                    exceptionSource.insert(totalRecords, {
                        id: currentEmployee.id,
                        employeeCode: currentEmployee.code,
                        employeeName: currentEmployee.fullName,
                    });
                    //break;
                    //}
                }
            }
            else {
                exceptionSource.insert(totalRecords, {
                    id: currentEmployee.id,
                    employeeCode: currentEmployee.code,
                    employeeName: currentEmployee.fullName,
                });

            }



        }




    });

    //Multi select 
    var multiSelectSource = new kendo.data.DataSource({
        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/HrEmployee/GetAllBetweenTwoCode"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        firstCode: $("#FirstCode").val(),
                        secondCode: $("#SecondCode").val(),
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    fullName: {
                        type: "string"
                    },
                    code: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#multiselect").kendoMultiSelect({
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + ' </span>' +
            '<span>' + Resources.EmployeeName + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.code #</span>' +
            '<span>#: data.fullName #</span>',
        dataTextField: "fullName",
        dataValueField: "id",
        //placeholder: Resources.AutocompleateChoose,
        dataSource: multiSelectSource
    });

    //hide and show extra time or basic salary
    $('input[name="IsBasicSalary"]').change(function () {
        if (this.value == "true") {
            var grid = $("#GridSalariesThroughBanks").data("kendoGrid");
            grid.showColumn("basicSalary");
            grid.hideColumn("overtimeValue");
        }
        else {
            var grid = $("#GridSalariesThroughBanks").data("kendoGrid");
            grid.showColumn("overtimeValue");
            grid.hideColumn("basicSalary");

        }
    });
});

$("#btnDataReview").on('click', function () {
    var fK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
        fK_CostCenterId = parseInt($("#FK_CostCenterId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var gridExceptionsData = $('#GridException').data("kendoGrid").dataSource.data();
    var ids = [];
    for (var i = 0; i < gridExceptionsData.length; i++) {
        ids.push(gridExceptionsData[i].id);
    }
    debugger
    $('.exportExcel').fadeIn('slow');
    $('#GridSalariesThroughBanks').data('kendoGrid').dataSource.read({ fK_HrEmployeeId: fK_HrEmployeeId, fK_CostCenterId: fK_CostCenterId, dateFrom: dateFrom, dateTo: dateTo, ids: ids, fK_DefBranchId: fK_DefBranchId });
});

$(".exportExcel").on('click', function () {
    $("#GridSalariesThroughBanks").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    debugger;
    var fK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
        fK_CostCenterId = parseInt($("#FK_CostCenterId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var gridExceptionsData = $('#GridException').data("kendoGrid").dataSource.data();
    var ids = [];
    for (var i = 0; i < gridExceptionsData.length; i++) {
        ids.push(gridExceptionsData[i].id);
    }
    var url = "/HrReports/EmployeesHaveNotBankAccountPrint?fK_HrEmployeeId=" + fK_HrEmployeeId + "&fK_CostCenterId=" + fK_CostCenterId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&ids=" + ids + "&fK_DefBranchId=" + fK_DefBranchId;
    window.open(url, '_blank');
});
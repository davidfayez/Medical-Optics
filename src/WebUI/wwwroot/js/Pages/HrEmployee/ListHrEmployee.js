$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#hrEmployeeId").val(null);
        $("#employeeName").val("");

        $("#FK_CostCenterId").data("kendoDropDownList").dataSource.read();
        $("#FK_CostCenterId").data("kendoDropDownList").value(0);

        $("#subBranchSelect").data("kendoDropDownList").dataSource.read();
        $("#subBranchSelect").data("kendoDropDownList").value(0);

        $("#FK_HrManagement").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagement").data("kendoDropDownList").value(0);

        $("#FK_HrDepartment").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartment").data("kendoDropDownList").value(0);

    });

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
    });

    $("#FK_CostCenterId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
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
    });


    $("#subBranchSelect").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "branchNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrSubBranchForDDList",
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
    $("#FK_HrManagement").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
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

    });
    $("#FK_HrDepartment").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
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

    });

    var dataSourceEmployees = new kendo.data.DataSource({

        transport: {
            read: {
                url: "/HrEmployee/SearchInHrEmployee",
                dataType: "json",
                Type: "GET"
            },
            //  read: "/HrEmployee/SearchInHrEmployee?id=" + id + "&&managementId=" + managementId + "&&departId=" + departId + "&&idNumber=" + idNum + "&&branch=" + branch + "&&subBranch=" + subBranch + "&&costcenterId=" + costcenter + "&&displayEmployee=" + displayEmployee
        },
        parameterMap: function (data, type) {
            if (type == "read") {
                return {
                    id: $("#FK_HrEmployeeId").val(),
                    managementId: $("#FK_HrManagement").val(),
                    departId: $("#FK_HrDepartment").val(),
                    idNumber: $("#idNumbertxt").val(),
                    branch: $("#FK_DefBranchId").val(),
                    subBranch: $("#subBranchSelect").val(),
                    costcenterId: $("#FK_CostCenterId").val(),
                    displayEmployee: $('input[name="Display"]:checked').val(),
                    dateFrom : $("#DateFrom").val(),
                    dateTo : $("#DateTo").val(),
                };
            }
        },
        pageSize: Resources.GridPageSize,
        schema: {
            model: {
                id: "id",
                fields: {
                    code: { type: "string" },
                    fullName: { type: "string" },
                    departmentName: { type: "string" },
                    salary: { type: "string" },
                    creator: { editable: false },
                    IsDeleted: { type: "string" },
                    IsActive: { type: "string" },
                    creationDate: { type: "date", editable: false },
                }
            }
        }
    });
    var grid = $("#HrEmployeeList").kendoGrid({
      
        excel: {
            fileName: "Employee.xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: dataSourceEmployees,
        height: Resources.GridHeight,
        sortable: Resources.GridSortable,
        reorderable: Resources.GridReorderable,
        groupable: Resources.GridGroupable,
        resizable: Resources.GridResizable,
        filterable: Resources.GridFilterable,
        columnMenu: Resources.GridColumnMenu,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },
        pageable: {
            pageSizes: [20, 40, 60, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [{
            field: "code",
            title: Resources.Code,
            width: Resources.CodeWidth
        }, {
            field: "fullName",
            title: Resources.FullName,
            width: Resources.NameWidth
        }, {
            field: "departmentName",
            title: Resources.DepartmentName,
            width: Resources.NameWidth
        }, {
            field: "salary",
            title: Resources.Salary,
            width: Resources.AmountWidth
        },
            { field: "creator ", title: Resources.UserName, width: Resources.NameWidth },
            { field: "creationDate ", title: Resources.CreationDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
        { title: Resources.Status, width: Resources.DoubleActionWidth, template: "#if(isDeleted==true){# " + Resources.Deleted + " #}else if(isActive==true){# " + Resources.Active + " #}else{#" + Resources.Inactive + "#}#" },


        //  { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
        {
            width: Resources.DoubleActionWidth,
            template: '#if(standalone==="True") {#<a  href="/HrEmployee/Edit/#= id #?standalone=1"  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a>#} else {# <a  href="/HrEmployee/Edit/#= id # "  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> #} if(isDeleted==false){# <a  class="btn btn-danger btn-sm btnDelete" ><i class="fas fa-trash-alt"></i></a>#}else{# <a  style="background-color:lightgreen!important" class="btn btn-sm btnRetrieve" ><i class="fas fa-reply"></i></a> #}#'

        },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                //    //if (dataItem.isActive) {
                //    //    $(this).addClass("k-state-selected");
                //    //}
            });
            if (!hasRoleEdit)
                $(".btnEdit").addClass('disabled');

            if (!hasRoleDelete)
                $(".btnDelete").addClass('disabled');
        }
    });
    grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployee);
    grid.data("kendoGrid").table.on("click", ".btnRetrieve", retrieveEmployee);

    function removeEmployee() {

        var row = $(this).closest("tr"),
            grid = $("#HrEmployeeList").data("kendoGrid"),
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
                $.ajax({
                    url: "/HrEmployee/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                       
                        if (result) {
                            //LoadGridEmployee();
							grid.removeRow(row);
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
    function retrieveEmployee() {

        var row = $(this).closest("tr"),
            grid = $("#HrEmployeeList").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
        swal({
            title: Resources.Retrieve,
            text: Resources.RetrieveConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.Retrieve,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/HrEmployee/Retrieve?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        
                        if (result) {
                            //LoadGridEmployee();
							grid.removeRow(row);
                            swal({
                                title: Resources.RetrieveSuccessResource,
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
});

$("#employeeSearchbtn").click(function () {
    

    var id= $("#FK_HrEmployeeId").val();
    var managementId= $("#FK_HrManagement").val();
    var departId= $("#FK_HrDepartment").val();
    var idNumber= $("#idNumbertxt").val();
    var branch=$("#FK_DefBranchId").val();
    var subBranch= $("#subBranchSelect").val();
    var costcenterId= $("#FK_CostCenterId").val();
    var displayEmployee = $('input[name="Display"]:checked').val();
    var dateFrom = $("#DateFrom").val();
    var dateTo = $("#DateTo").val();

    $("#HrEmployeeList").data("kendoGrid").dataSource.read({ id: id, managementId: managementId, departId: departId, idNumber: idNumber, branch: branch, subBranch: subBranch, costcenterId: costcenterId, displayEmployee: displayEmployee, dateFrom: dateFrom, dateTo: dateTo });
});


$(".exportExcel").on('click', function () {
    $("#HrEmployeeList").getKendoGrid().saveAsExcel(); 
});

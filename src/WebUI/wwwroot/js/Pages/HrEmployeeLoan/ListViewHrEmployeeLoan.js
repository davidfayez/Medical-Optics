$(document).ready(function () {
    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GridEmployeeLoan').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);
    });
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

    loadEmployeeLoanGrid();

    function loadEmployeeLoanGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeLoan/GetAllEmployeeRequestLoan?fK_DefBranchId=" + $("#FK_DefBranchId").val() + "&&employeeId=" + $("#FK_HrEmployeeId").val() + "&&requestDate=" + $("#CreationDate").val() + "&&id=" + $("#RequestId").val() ,
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
                        employeeCode: { editable: false },
                        employeeName: { editable: false },
                        totalAmount: { type: "number", editable: false },
                        installmentCount: { type: "number", editable: false },
                        isActive: { editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isDeleted: { editable: false },
                        creator: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridEmployeeLoan").kendoGrid({
            excel: {
                fileName: "Employee Loan.xlsx",
                allPages: true,
                filterable: true
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

                { field: "employeeCode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "totalAmount", title: Resources.TotalAmount, width: Resources.NameWidth },
                //{
                //    field: "loanDate", title: Resources.DatePayment, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                //    filterable: {
                //        operators: {
                //            date: {
                //                gte: Resources.IsAfterOrEqualTo,
                //                lte: Resources.IsBeforeOrEqualTo
                //            }
                //        },
                //        extra: false,
                //        ui: function (element) {
                //            element.kendoDatePicker({
                //                format: '{0: dd/MM/yyyy}'
                //            })
                //        }
                //    }
                //},

                //{ field: "creator ", title: Resources.UserName, width: Resources.NameWidth },
                //{
                //    field: "lastModifiedDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                //    filterable: {
                //        operators: {
                //            date: {
                //                gte: Resources.IsAfterOrEqualTo,
                //                lte: Resources.IsBeforeOrEqualTo
                //            }
                //        },
                //        extra: false,
                //        ui: function (element) {
                //            element.kendoDatePicker({
                //                format: '{0: dd/MM/yyyy}'
                //            })
                //        }
                //    }
                //},
                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeLoan/Create/#= id # ?module=" + moduleCB+"'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> "
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
    }


    $("#btnDataReview").click(function () {
        loadEmployeeLoanGrid();
    })
   

});

$(".exportExcel").on('click', function () {
    $("#GridEmployeeLoan").getKendoGrid().saveAsExcel();
});

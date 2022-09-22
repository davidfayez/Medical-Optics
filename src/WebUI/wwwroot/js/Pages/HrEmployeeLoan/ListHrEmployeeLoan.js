$(document).ready(function () {
    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GridEmployeeLoan').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
    loadEmployeeLoanGrid();

    function loadEmployeeLoanGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeLoan/GetAllEmployeeLoan",
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
                        datePayment: { type: "date", editable: false },
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
                { field: "installmentCount", title: Resources.InstallmentCount, width: Resources.NameWidth },
                {
                    field: "datePayment", title: Resources.DatePayment, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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

                { field: "creator ", title: Resources.UserName, width: Resources.NameWidth },
                {
                    field: "lastModifiedDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { title: Resources.Status, width: Resources.DoubleActionWidth, template: "#if(isDeleted==true){# " + Resources.Deleted + " #}else if(isActive==true){# " + Resources.Active + " #}else{#" + Resources.Inactive + "#}#" },

                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeLoan/Edit/#= id #?module=Cash and Banks'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> #if(isDeleted==false){#<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>#}else{# <a  style='background-color:lightgreen!important' class='btn btn-sm btnRetrieve' ><i class='fas fa-reply'></i></a> #}#"
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeLoan);
        grid.data("kendoGrid").table.on("click", ".btnRetrieve", retrieveLoan);
    }

    function removeEmployeeLoan() {

        var row = $(this).closest("tr"),
            grid = $("#GridEmployeeLoan").data("kendoGrid"),
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
                    url: "/HrEmployeeLoan/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadEmployeeLoanGrid();
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

    function retrieveLoan() {

        var row = $(this).closest("tr"),
            grid = $("#GridEmployeeLoan").data("kendoGrid"),
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
                    url: "/HrEmployeeLoan/Retrieve?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadEmployeeLoanGrid();
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

$(".exportExcel").on('click', function () {
    $("#GridEmployeeLoan").getKendoGrid().saveAsExcel();
});

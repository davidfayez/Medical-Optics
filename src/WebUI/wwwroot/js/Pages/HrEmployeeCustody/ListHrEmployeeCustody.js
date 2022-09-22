$(document).ready(function () {
    $("#DefBranches").change(function () {
        loadEmployeeCustody();
    });
    loadEmployeeCustody();

    function loadEmployeeCustody() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetAll",
                    Type: "GET"
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    }
                    else {
                        return data;
                    }
                }
            },
            pageSize: Resources.GridPageSize,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        fK_SecModuleId: { editable: false },
                        fK_SecModulePageId: { editable: false },
                        serial: { type: "number", editable: false },
                        employeeCode: { editable: false },
                        employeeName: { editable: false },
                        totalAmount: { editable: false },
                        dateCustody: { type: "date", editable: false },
                        isActive: { editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isDeleted: { editable: false },
                        creator: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridEmployeeCustody").kendoGrid({
            excel: {
                fileName: "Employee Custody.xlsx",
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
                { field: "employeeCode", title: Resources.EmployeeCode, width: Resources.CodeWidth },                
                { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "serial", title: Resources.CustodySerial, width: Resources.CodeWidth },
                { field: "totalAmount", title: Resources.CustodyAmount, width: Resources.CodeWidth },
                {
                    field: "dateCustody", title: Resources.Date, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                
                {
                    title: Resources.ExchangeBond, width: Resources.CodeWidth, template: "<a  href='/CbExchangeBond/Create?refId=#= id #&refType=#=fK_SecModuleId#&pageId=#=fK_SecModulePageId#' class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>"
                },
                {
                    title: Resources.ReceiptBond, width: Resources.CodeWidth, template: "<a  href='/CbReceiptBond/Create?refId=#= id #&refType=#=2#&pageId=#=79#'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>"
                },
                {
                    title: Resources.CustodyStatment, width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeCustody/RevealExpensesCustody/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>"
                },
                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeCustody/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>"
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeCustody);
    }

    function removeEmployeeCustody() {

        var row = $(this).closest("tr"),
            grid = $("#GridEmployeeCustody").data("kendoGrid"),
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
                    url: "/HrEmployeeCustody/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadEmployeeCustody();
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


});

$(".exportExcel").on('click', function () {
    $("#GridEmployeeCustody").getKendoGrid().saveAsExcel();
});

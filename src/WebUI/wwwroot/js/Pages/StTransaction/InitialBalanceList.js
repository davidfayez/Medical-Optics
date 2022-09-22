$(document).ready(function () {

    loadInitialBalanceGrid();

    function loadInitialBalanceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StTransaction/GetAllInitialBalance",
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
                        serialNumber: { editable: false },
                        serialPrefix: { editable: false },
                        bookNumber: { editable: false },
                        storeName: { editable: false },
                        totalItemCount: { editable: false },
                        totalSalesPrice: { editable: false },
                        totalPurchasePrice: { editable: false },
                        totalCostPrice: { editable: false },
                        totalDiscount: { editable: false },
                        finalTotal: { editable: false },
                        transactionDate: { type: "date", editable: false },
                    }
                }
            }
        });


        var grid = $("#GridInitialBalance").kendoGrid({
            excel: {
                fileName: "Initial Balances.xlsx",
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
                { field: "serialNumber", title: Resources.SerialNumber, width: Resources.NameWidth },
                { field: "bookNumber", title: Resources.DetectionNumber, width: Resources.NameWidth },
                { field: "storeName", title: Resources.Store, width: Resources.NameWidth },
                {
                    field: "transactionDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { field: "totalItemCount", title: Resources.TotalQuantity, width: Resources.AmountWidth },
                { field: "totalSalesPrice", title: Resources.TotalSalesPrice, width: Resources.AmountWidth },
                { field: "totalPurchasePrice", title: Resources.TotalPurchasePrice, width: Resources.AmountWidth },
                { field: "totalCostPrice", title: Resources.TotalCostPrice, width: Resources.AmountWidth },
                { field: "totalDiscount", title: Resources.TotalDiscount, width: Resources.AmountWidth },
                { field: "finalTotal", title: Resources.TotalBill, width: Resources.AmountWidth },

                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

                { width: Resources.DoubleActionWidth, template: "<a  href='/StTransaction/EditInitialBalance/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeInvoice);
    }

    function removeInvoice() {


        var row = $(this).closest("tr"),
            grid = $("#GridInitialBalance").data("kendoGrid"),
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
                    url: "/StTransaction/DeleteInitialBalance?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadInitialBalanceGrid();
                            //grid.refresh();
                            //grid.dataSource.filter(filters);
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
    $("#GridInitialBalance").getKendoGrid().saveAsExcel();
});
$(document).ready(function () {

    $("#btnSearch").click(function () {
        loadReturnedToSupplierGrid();
    });

    loadReturnedToSupplierGrid();

    function loadReturnedToSupplierGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StTransaction/GetAllReturnedToSupplier?storeId=" + $("#FK_StStoreFromId").val() + "&supplierId=" + $("#FK_PaySupplierId").val() + "&serialNumber=" + $("#SerialNumber").val() + "&transactionDate=" + $("#TransactionDate").val() + "&returnType=" + $("input[name='ReturnType']:checked").val(),
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageMainCategory: 10,
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        serialNumber: { editable: false },
                        serialPrefix: { editable: false },
                        finalTotal: { editable: false },
                        paySupplierName: { editable: false },
                        storeName: { editable: false },
                        transactionDate: { type: "date", editable: false },

                    }
                }
            }
        });


        var grid = $("#ReturnedToSupplierGrid").kendoGrid({
            excel: {
                fileName: "Returned To Suppliers.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageMainCategory: 20,
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
                pageMainCategorys: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "serialNumber", title: Resources.SerialNumber, width: Resources.NameWidth },
                { field: "paySupplierName", title: Resources.SupplierNameResource, width: Resources.NameWidth },
                { field: "storeName", title: Resources.Store, width: Resources.NameWidth },
                { field: "finalTotal", title: Resources.TotalBill, width: Resources.NameWidth },
                {
                    field: "transactionDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { width: Resources.DoubleActionWidth, template: "<a  href='/StTransaction/EditReturnedSupplier/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

                //   { width: Resources.DoubleActionWidth, template: "<a  href='/StTransaction/CreateReceiveRequests/#= id #'  title=" + Resources.Receive + " class='btn btn-success btn-sm btnCreateRecive'><i class='fas fa-arrow-alt-circle-right'></i></a> " },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });
                if (!hasRoleEdit)
                    $(".btnedit").addclass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeReturnedToSupplier);
    }
    function removeReturnedToSupplier() {

        var row = $(this).closest("tr"),
            grid = $("#ReturnedToSupplierGrid").data("kendoGrid"),
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
                    url: "/StTransaction/DeleteReturnedToSupplier?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadReturnedToSupplierGrid();
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
    $("#ReturnedToSupplierGrid").getKendoGrid().saveAsExcel();
});
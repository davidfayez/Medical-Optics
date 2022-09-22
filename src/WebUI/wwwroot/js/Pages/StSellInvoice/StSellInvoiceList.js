$(document).ready(function () {

    $("#searchRecivedbtn").click(function () {
        loadStoreTransferGrid();
    })  
    loadStoreTransferGrid();

    function loadStoreTransferGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StTransaction/GetAllStoreTransfer?FK_StStoreToId=" + $("#FK_StStoreToId").val() + "&&FK_StStoreFromId=" + $("#FK_StStoreFromId").val()
                        + "&&SerialNumber=" + $("#SerialNumber").val() + "&&TransactionDate=" + $("#TransactionDate").val() ,
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
                        operatingNumber: { editable: false },
                        serialNumber: { editable: false },
                        serialPrefix: { editable: false },
                        storeFrom: { editable: false },
                        storeTo: { editable: false },
                        finalTotal: { editable: false },
                        description: { editable: false },
                        transactionDate: { type: "date", editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#storeTransferGrid").kendoGrid({
            excel: {
                fileName: "Hr Job.xlsx",
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

                { field: "transactionDate", title: Resources.TransferDate, width: Resources.DateWidth, format: "{0:yyyy/MM/dd}" },
                { field: "serialPrefix", title: Resources.BillNumberResource, width: Resources.NameWidth },
                { field: "operatingNumber", title: Resources.OperatingNumber, width: Resources.NameWidth },
                { field: "storeFrom", title: Resources.StoreFrom, width: Resources.NameWidth },
                { field: "storeTo", title: Resources.StoreTo, width: Resources.NameWidth },
                { field: "finalTotal", title: Resources.Total, width: Resources.NameWidth },

                //{ width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

                {
                    field: "creationDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { width: Resources.DoubleActionWidth, template: "<a  href='/StTransaction/EditStoreTransfer/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeStoreTransfer);
    }

    function removeStoreTransfer() {

        var row = $(this).closest("tr"),
            grid = $("#storeTransferGrid").data("kendoGrid"),
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
                    url: "/StTransaction/DeleteStoreTransfer?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadStoreTransferGrid();
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
    $("#storeTransferGrid").getKendoGrid().saveAsExcel();
});
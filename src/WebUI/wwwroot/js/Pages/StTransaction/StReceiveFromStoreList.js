$(document).ready(function () {

    $("#mainStStoreId").change(function () {


    });
    var url = "/StTransaction/GetAllStReceiveFromStoreByStoreId";
    loadStReceiveFromStoreGrid();

    $("#searchRecivedbtn").click(function () {
        url = "/StTransaction/GetAllStReceiveFromStoreByStoreId?FK_StStoreToId=" + $("#FK_StStoreToId").val()
            + "&&SerialNumber=" + $("#SerialNumber").val() + "&&OperatingNumber=0&&TransactionDate=" + $("#TransactionDate").val() + "&&FK_StStatusId=" + $("#FK_StStatusId").val();
        loadStReceiveFromStoreGrid();
    })

    function loadStReceiveFromStoreGrid() {

        var dataSource = new kendo.data.DataSource({
            pageMainCategory: 10,
            pageSize: Resources.GridPageSize,
            transport: {
                read: {
                    url: url,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageMainCategory: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        storeFromName: { editable: false },
                        storeToName: { editable: false },
                        serialNumber: { editable: false },
                        serialPrefix: { editable: false },
                        transactionDate: { type: "date", editable: false },

                    }
                }
            }
        });


        var grid = $("#StReceiveFromStoreGrid").kendoGrid({
            excel: {
                fileName: "Stock Branch Exchange.xlsx",
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

                { field: "storeFromName", title: Resources.StoreFrom, width: Resources.NameWidth },
                { field: "storeToName", title: Resources.StoreTo, width: Resources.NameWidth },
                { field: "serialPrefix", title: Resources.SerialNumber, width: Resources.NameWidth },
                //{ field: "deliveryNumber", title: Resources.DeliveryNumber, width: Resources.NameWidth },

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
                { width: Resources.ActionWidth, template: "#if( fK_StStatusId==1){# <a  href='/StTransaction/CreateReceiveFromStore/#= id #'  title=" + Resources.Receive + " class='btn btn-success btn-sm btnEdit'><i class='fas fa-arrow-alt-circle-right'></i></a> #}#" },
                { width: Resources.ActionWidth, template: "#if( fK_StStatusId!=1){#<a  href='/StTransaction/EditReceiveFromStore/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> #}#" },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeStBrand);
    }

    function removeStBrand() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#StReceiveFromStoreGrid").data("kendoGrid"),
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
                    url: "/StTransaction/DeleteReceiveFromStoreWithDetails?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadStReceiveFromStoreGrid();
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
    $("#StReceiveFromStoreGrid").getKendoGrid().saveAsExcel();
});
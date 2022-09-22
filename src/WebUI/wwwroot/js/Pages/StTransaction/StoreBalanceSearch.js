$(document).ready(function () {

    $("#FK_StMainStoreId").change(function () {

        if ($("#FK_StMainStoreId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllSubStoresByParentId?id=' + $("#FK_StMainStoreId").val(),
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    debugger
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].storeNameAr + '</options>'
                    }
                    $("#subStStoreId").html(options)
                }
            })
        }
    });
    $("#btnDataReview").click(function () {
        LoadStoreBalanceGrid();
    });

    $("#storeBalanceGrid").kendoGrid({

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
        pageable: Resources.GridPageable,
        columns: [
            { title: Resources.Store, width: Resources.NameWidth },
            { title: Resources.TransactionType, width: Resources.NameWidth },
            { title: Resources.ItemName, width: Resources.NameWidth },
            { title: Resources.CostPrice, width: Resources.InputNumberWidth },
            { title: Resources.PurchasePrice, width: Resources.InputNumberWidth },
            { title: Resources.SalesPrice, width: Resources.InputNumberWidth },
            { title: Resources.Quantity, width: Resources.NameWidth },

        ]
    });

    function LoadStoreBalanceGrid() {
        var dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            store = $("#subStStoreId").val() > 0 ? $("#subStStoreId").val() : $("#FK_StMainStoreId").val(),
            itemId = $("#FK_StItemId").val(),
            serial = $("#Serial").val(),
            bookNum = $("#BookNumber").val(),
            deliveryNum = $("#DeliveryNumber").val(),
            price = $("#Price").val(),
            priceType = $("#PriceType").val(),
            unit = $("#FK_StUnit").val();

        if (dateFrom != null && dateTo != null) {
            var grid = $("#storeBalanceGrid").kendoGrid({
                excel: {
                    fileName: "Store Balance.xlsx",
                    allPages: true,
                    filterable: true
                },
                dataSource: {
                    transport: {
                        read: {
                            url: "/StTransaction/ViewStoreBalance?dateFrom=" + dateFrom + "&&dateTo=" + dateTo + "&&storeId=" + store
                                + "&&itemId=" + itemId + "&&serial=" + serial + "&&bookNumber=" + bookNum + "&&deliveryNumber=" + deliveryNum + "&&price=" + price + "&&PriceType=" + priceType + "&&unit=" + unit
                        }
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                storeName: { type: "string" },
                                barcode: { type: "string" },
                                itemName: { type: "string" },
                                transactionType: { type: "string" },
                                unitCostPrice: { type: "string" },
                                unitPurchasePrice: { type: "string" },
                                unitSalesPrice: { type: "string" },
                                quantity: { type: "string" }
                            }
                        }
                    },
                    pageSize: Resources.GridPageSize
                },
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
                pageable: Resources.GridPageable,
                columns: [

                    { field: "storeName", title: Resources.Store, width: Resources.NameWidth },
                    { field: "transactionType", title: Resources.TransactionType, width: Resources.NameWidth },
                    { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                    { field: "unitCostPrice", title: Resources.CostPrice, width: Resources.InputNumberWidth },
                    { field: "unitPurchasePrice", title: Resources.PurchasePrice, width: Resources.InputNumberWidth },
                    { field: "unitSalesPrice", title: Resources.SalesPrice, width: Resources.InputNumberWidth },
                    { field: "quantity", title: Resources.Quantity, width: Resources.NameWidth },

                ],
                dataBound: function (e) {
                    e.sender.items().each(function () {
                        var dataItem = e.sender.dataItem(this);
                        kendo.bind(this, dataItem);
                        if (dataItem.isActive) {
                            //$(this).addClass("k-state-selected");
                        }
                    });
                }
            });
        } else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }
});

$(".exportExcel").on('click', function () {
    $("#storeBalanceGrid").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        store = $("#subStStoreId").val() > 0 ? $("#subStStoreId").val() : $("#FK_StMainStoreId").val(),
        itemId = $("#FK_StItemId").val(),
        serial = $("#Serial").val(),
        bookNum = $("#BookNumber").val(),
        deliveryNum = $("#DeliveryNumber").val(),
        price = $("#Price").val(),
        priceType = $("#PriceType").val(),
        unit = $("#FK_StUnit").val();

    var url = "/StTransaction/StoreBalancePrint?dateFrom=" + dateFrom + "&&dateTo=" + dateTo + "&&storeId=" + store
        + "&&itemId=" + itemId + "&&serial=" + serial + "&&bookNumber=" + bookNum + "&&deliveryNumber=" + deliveryNum + "&&price=" + price + "&&PriceType=" + priceType + "&&unit=" + unit
    window.open(url, '_blank');

});
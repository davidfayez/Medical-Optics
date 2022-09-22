$(document).ready(function () {

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PurPriceOfferDetailSupplierPrice/GetPurOfferDetailSupplierPriceById?id=" + id,
                Type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }
        },
        //autoSync: true,
        batch: true,
        //pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: true },
                    fK_PurPriceOfferDetailId: { editable: true },
                    fK_StItemId: { editable: false },
                    fK_StUnitId: { editable: false },
                    fK_StMainCategoryId: { editable: false },
                    fK_StStatusId: { editable: false },
                    itemBarcode: { editable: false },
                    itemName: { editable: false },
                    quantity: { editable: false },
                    supplierNameAr: { editable: false },
                    price: { editable: false },

                }
            }
        },
    });

    var ApprovedDetail = $("#ApproveDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            {
                title: 'Select All',
                headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>",
                template: function (dataItem) {
                    return "<input type='checkbox' id='" + dataItem.id + "' class='k-checkbox row-checkbox'><label class='k-checkbox-label' for='" + dataItem.id + "'></label>";
                },
                width: Resources.CheckboxWidth
            },
            { field: "fK_PurPriceOfferDetailId", hidden: true },
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "fK_StStatusId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "supplierNameAr", title: Resources.SupplierNameResource, width: Resources.NameWidth },
            { field: "price", title: Resources.Price, width: Resources.AmountWidth },
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
            });
            debugger;
            var view = this.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (view[i].fK_StStatusId == 8) {
                    this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                        .addClass("k-state-selected")
                        .find(".k-checkbox")
                        .attr("checked", "checked")
                        .attr("disabled", "disabled");

                }
            }
        },
        editable: false,
        selectable: "multiple, cell",


    });
    var thisRow = "";

    //bind click event to the checkbox
    $("#ApproveDetailGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

    $('#header-chb').change(function (ev) {
        var checked = ev.target.checked;
        var s = $('.row-checkbox');
        $('.row-checkbox').each(function (idx, item) {
            if (checked) {
                var c = $(item).closest('tr').is('.k-state-selected');
                if (!($(item).closest('tr').is('.k-state-selected'))) {
                    $(item).click();
                }

            } else {
                if ($(item).closest('tr').is('.k-state-selected')) {
                    $(item).click();
                }

            }
        });
    });

    $("#btnSave").bind("click", function () {

        var data = getCheckedData();
        if (data.length === 0) {
            data = getAllData();
        }
        swal({
            title: Resources.Approve,
            text: Resources.ApproveMessage,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.Approve,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {

                var purPriceOffer = {
                    Id:id,
                    details: data
                }
                $.ajax({
                    url: '/PurPriceOffer/Approve',
                    type: 'POST',
                    data: { purPriceOfferVM: purPriceOffer },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DoneResource + " " + Resources.Approve,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                window.location.href = '/PurPriceOffer/Index';
                            });
                        }
                        else {
                            swal({
                                title: Resources.ErrorMsgResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    });

    $("#btnSaveAndOrderedSupply").click(function () {
     
        var ids = getCheckedIds();
        if (ids.length === 0) {
            ids = getAllIds();
        }
        //var id = $("#Id").val();
        if (id > 0 && ids.length > 0) {
            swal({
                title: Resources.Approve,
                text: Resources.ApproveMessage,
                type: "info",
                showCancelButton: true,
                confirmButtonText: Resources.Approve,
                cancelButtonText: Resources.CancelResource,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {

                    document.location = "../../PurSupplyingOrder/Create?id=" + id + "&ids=" + ids;

                }, 3000);
            });

        }
        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "success"
            });
        }
    })

    function getCheckedData() {
        debugger;
        var editedData = [];

        gridData = $("#ApproveDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            var expiryDate = new Date(gridData[i].expiryDate);
            var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);

            if (checkedIds[gridData[i].id]) {
                var row = {
                    Id: gridData[i].fK_PurPriceOfferDetailId,
                    FK_StItemId: gridData[i].fK_StItemId,
                    Quantity: gridData[i].quantity,
                    FK_StUnitId: gridData[i].fK_StUnitId,
                    FK_PurPriceOfferId: gridData[i].fK_PurPriceOfferId,
                    FK_StMainCategoryId: gridData[i].fK_StMainCategoryId,
                    ItemBarcode: gridData[i].itemBarcode,
                    ItemName: gridData[i].itemName,
                };
                editedData.push(row);
            }

        }
        return editedData;
    }

    function getAllData() {
        debugger;
        var editedData = [];

        gridData = $("#ApproveDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            var expiryDate = new Date(gridData[i].expiryDate);
            var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);

            var row = {
                Id: gridData[i].fK_PurPriceOfferDetailId,
                FK_StItemId: gridData[i].fK_StItemId,
                Quantity: gridData[i].quantity,
                FK_StUnitId: gridData[i].fK_StUnitId,
                FK_PurPriceOfferId: gridData[i].fK_PurPriceOfferId,
                FK_StMainCategoryId: gridData[i].fK_StMainCategoryId,
                ItemBarcode: gridData[i].itemBarcode,
                ItemName: gridData[i].itemName,
            };
            editedData.push(row);

        }
        return editedData;
    }

    function getCheckedIds() {
        debugger;
        var selectedIds = [];

        gridData = $("#ApproveDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {

            if (checkedIds[gridData[i].id]) {

                selectedIds.push(gridData[i].fK_PurPriceOfferDetailId);
            }


        }
        return selectedIds;
    }

    function getAllIds() {
        debugger;
        var allIds = [];

        gridData = $("#ApproveDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {

            allIds.push(gridData[i].fK_PurPriceOfferDetailId);
        }
        return allIds;
    }
})

var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#ApproveDetailGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

    //var TotalItemCount = $("#TotalItemCount").val(),//quantity
    //    TotalPurchasePrice = $("#TotalPurchasePrice").val(),
    //    TotalSalesPrice = $("#TotalSalesPrice").val(),
    //    TotalCostPrice = $("#TotalCostPrice").val(),
    //    TotalDiscount = $("#TotalDiscount").val(),
    //    FinalTotal = $("#FinalTotal").val();
    debugger;
    checkedIds[dataItem.id] = checked;

    if (checked) {
        //-select the row
        row.addClass("k-state-selected");

        var checkHeader = true;

        $.each(grid.items(), function (index, item) {
            if (!($(item).hasClass("k-state-selected"))) {
                checkHeader = false;
            }
        });

        $("#header-chb")[0].checked = checkHeader;
    } else {

        //-remove selection
        row.removeClass("k-state-selected");
        $("#header-chb")[0].checked = false;
    }
}

//on dataBound event restore previous selected rows:
function onDataBound(e) {
    var view = this.dataSource.view();
    console.log(view);
    for (var i = 0; i < view.length; i++) {
        if (checkedIds[view[i].id]) {
            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                .addClass("k-state-selected")
                .find(".k-checkbox")
                .attr("checked", "checked");
        }
    }
}
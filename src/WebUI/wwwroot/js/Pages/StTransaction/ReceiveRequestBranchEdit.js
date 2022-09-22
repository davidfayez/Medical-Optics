$(document).ready(function () {

    //var now = new Date(),
    //    today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    //$('#ExpiryDate').val(today);

    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/StTransaction/GetReceiveRequestBranchDetailsById?id=" + id,
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
                    fK_StTransactionId: { editable: true },
                    fK_StItemId: { editable: false },
                    fK_StGenderId: { editable: false },
                    fK_StBrandId: { editable: false },
                    fK_StModelId: { editable: false },
                    fK_StColorId: { editable: false },
                    fK_StSizeId: { editable: false },
                    fK_StUnitId: { editable: false },
                    totalCostPrice: { editable: false },
                    totalSalsePrice: { editable: false },
                    itemBarcode: { type: "text", editable: false },
                    itemName: { type: "text", editable: false },
                    unitName: { type: "text", editable: false },
                    quantityFrom: { type: "number", editable: false },
                    discount: { type: "number", editable: false },
                    unitPurchasePrice: { type: "number", editable: false },
                    unitSalesPrice: { type: "number", editable: false },
                    unitCostPrice: { type: "number", editable: false },
                    finalTotal: { type: "number", editable: false },
                    expiryDate: { type: "date", editable: false },

                }
            }
        },
    });

    var ReceiveFromStore = $("#receiveRequestsDetailGrid").kendoGrid({
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
            { field: "fK_StTransactionId", hidden: true },
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StGenderId", hidden: true },
            { field: "fK_StBrandId", hidden: true },
            { field: "fK_StModelId", hidden: true },
            { field: "fK_StColorId", hidden: true },
            { field: "fK_StSizeId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "discount", hidden: true },
            { field: "unitPurchasePrice", hidden: true },
            { field: "totalCostPrice", hidden: true },
            { field: "totalSalsePrice", hidden: true },
            { field: "unitCostPrice", hidden: true },
            { field: "expiryDate", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            //  { field: "discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
            // { field: "unitPurchasePrice", title: Resources.UnitPurchasePrice, width: Resources.InputNumberWidth },
            { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            // { field: "unitCostPrice", title: Resources.UnitCostPrice, width: Resources.InputNumberWidth },

            // { field: "unitName", title: Resources.Unit, width: Resources.NameWidth },
            // { field: "expiryDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.DateExpiry },
            { field: "totalSalsePrice", title: Resources.TotalSalesPrice, width: Resources.NameWidth },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
            });
            var view = this.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (view[i].fK_StStatusId == 2)
                    checkedIds[view[i].id] = true
                if (checkedIds[view[i].id]) {
                    this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                        .addClass("k-state-selected")
                        .find(".k-checkbox")
                        .attr("checked", "checked");
                }
            }
        },
        editable: false,
        selectable: "multiple, cell",


    });
    var thisRow = "";

    //bind click event to the checkbox
    $("#receiveRequestsDetailGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

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

    $("#btnApprove").bind("click", function () {

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

                var tran = {
                    Id: parseInt(id),
                    SerialPrefixPurchaser: $("#SerialPrefixPurchaser").text() + $("#SerialNumberPurchaser").val(),
                    SerialNumberPurchaser: parseInt($("#SerialNumberPurchaser").val()),
                    FK_StStoreFromId: parseInt($("#FK_StStoreFromId").val()),
                    FK_StStoreToId: parseInt($("#FK_StStoreToId").val()),
                    TransactionDate: $("#TransactionDate").val(),
                    hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                    details: data
                }
                $.ajax({
                    url: '/StTransaction/ApproveReceiveFromBranch',
                    type: 'POST',
                    data: { requestsVM: tran },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DoneResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                //window.location.href = '/StTransaction/IndexReceiveRequests';
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

    $("#btnReject").bind("click", function () {
        debugger
        var data = getAllData();
        //if (data.length === 0) {
        //    data = getAllData();
        //}
        swal({
            title: Resources.Reject,
            text: Resources.RejectMessage,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.Reject,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {

                var tran = {
                    Id: parseInt(id),
                    SerialPrefixPurchaser: $("#SerialPrefixPurchaser").text() + $("#SerialNumberPurchaser").val(),
                    SerialNumberPurchaser: parseInt($("#SerialNumberPurchaser").val()),
                    FK_StStoreFromId: parseInt($("#FK_StStoreFromId").val()),
                    FK_StStoreToId: parseInt($("#FK_StStoreToId").val()),
                    TransactionDate: $("#TransactionDate").val(),
                    hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                    details: data
                }
                debugger
                $.ajax({
                    url: '/StTransaction/RejectReceiveRequest',
                    type: 'POST',
                    data: { requestsVM: tran },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DoneResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                window.location.href = '/StTransaction/IndexReceiveRequests';
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

    function getCheckedData() {
        debugger;
        var editedData = [];

        gridData = $("#receiveRequestsDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            var expiryDate = new Date(gridData[i].expiryDate);
            var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);

            if (checkedIds[gridData[i].id]) {
                var row = {
                    Id: gridData[i].id,
                    FK_StItemId: gridData[i].fK_StItemId,
                    QuantityFrom: 0,
                    QuantityTo: gridData[i].quantityFrom,
                    FK_StUnitId: gridData[i].fK_StUnitId,
                    FK_StBrandId: gridData[i].fK_StBrandId,
                    FK_StModelId: gridData[i].fK_StModelId,
                    FK_StGenderId: gridData[i].fK_StGenderId,
                    FK_StColorId: gridData[i].fK_StColorId,
                    FK_StSizeId: gridData[i].fK_StSizeId,
                    UnitPurchasePrice: gridData[i].unitPurchasePrice,
                    UnitCostPrice: gridData[i].unitCostPrice,
                    UnitSalesPrice: gridData[i].unitSalesPrice,
                    TotalCostPrice: gridData[i].totalCostPrice, // 
                    TotalSalsePrice: gridData[i].totalSalsePrice, ///
                    Discount: gridData[i].discount,
                    ExpiryDate: expiryDateFormated,
                };
                editedData.push(row);
            }


        }
        return editedData;
    }

    function getAllData() {
        debugger;
        var editedData = [];

        gridData = $("#receiveRequestsDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            var expiryDate = new Date(gridData[i].expiryDate);
            var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);

            var row = {
                Id: gridData[i].id,
                FK_StItemId: gridData[i].fK_StItemId,
                QuantityFrom: 0,
                QuantityTo: gridData[i].quantityFrom,
                FK_StUnitId: gridData[i].fK_StUnitId,
                FK_StBrandId: gridData[i].fK_StBrandId,
                FK_StModelId: gridData[i].fK_StModelId,
                FK_StGenderId: gridData[i].fK_StGenderId,
                FK_StColorId: gridData[i].fK_StColorId,
                FK_StSizeId: gridData[i].fK_StSizeId,
                UnitPurchasePrice: gridData[i].unitPurchasePrice,
                UnitCostPrice: gridData[i].unitCostPrice,
                UnitSalesPrice: gridData[i].unitSalesPrice,
                TotalCostPrice: gridData[i].totalCostPrice, // 
                TotalSalsePrice: gridData[i].totalSalsePrice, ///
                Discount: gridData[i].discount,
                ExpiryDate: expiryDateFormated,

            };
            editedData.push(row);

        }
        return editedData;
    }
})

var checkedIds = {};

////on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#receiveRequestsDetailGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

    var TotalItemCount = $("#TotalItemCount").val(),//quantity
        TotalPurchasePrice = $("#TotalPurchasePrice").val(),
        TotalSalesPrice = $("#TotalSalesPrice").val(),
        TotalCostPrice = $("#TotalCostPrice").val(),
        TotalDiscount = $("#TotalDiscount").val(),
        FinalTotal = $("#FinalTotal").val();
    debugger;
    checkedIds[dataItem.id] = checked;

    if (checked) {
        var QuantityFrom = dataItem.quantityFrom;
        var UnitPurchasePrice = dataItem.unitPurchasePrice;
        var UnitSalesPrice = dataItem.unitSalesPrice;
        var UnitCostPrice = dataItem.unitCostPrice;

        //if (TotalItemCount > 0) {
        //    $("#TotalItemCount").val(parseFloat(TotalItemCount) + parseFloat(QuantityFrom))
        //} else {
        //    $("#TotalItemCount").val(parseFloat(QuantityFrom))
        //}
        //if (TotalPurchasePrice > 0) {
        //    $("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) + (parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom)))
        //} else {
        //    $("#TotalPurchasePrice").val(parseFloat(UnitPurchasePrice) * parseFloat(QuantityFrom))
        //}
        //if (TotalSalesPrice > 0) {
        //    $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) + (parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom)))
        //} else {
        //    $("#TotalSalesPrice").val(parseFloat(UnitSalesPrice) * parseFloat(QuantityFrom))
        //}
        //if (TotalCostPrice > 0) {
        //    $("#TotalCostPrice").val(parseFloat(TotalCostPrice) + (parseFloat(UnitCostPrice) * parseFloat(QuantityFrom)))
        //} else {
        //    $("#TotalCostPrice").val(parseFloat(UnitCostPrice) * parseFloat(QuantityFrom))
        //}

        //اجمالى الفاتورة
        //   $("#FinalTotal").val(parseFloat($("#TotalSalesPrice").val()) * parseFloat($("#TotalItemCount").val()))

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
        //var Total = $("#TotalItemCount").val();
        //TotalQantity = TotalItemCount - dataItem.quantityFrom;
        //$("#TotalItemCount").val(TotalItemCount - dataItem.quantityFrom);
        //$("#TotalPurchasePrice").val(parseFloat(TotalPurchasePrice) - (parseFloat(dataItem.unitPurchasePrice) * parseFloat(dataItem.quantityFrom)));
        //$("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) - (parseFloat(dataItem.unitSalesPrice) * parseFloat(dataItem.quantityFrom)));
        //$("#TotalCostPrice").val(parseFloat(TotalCostPrice) - (parseFloat(dataItem.unitCostPrice) * parseFloat(dataItem.quantityFrom)))

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
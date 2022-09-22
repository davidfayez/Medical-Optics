$(document).ready(function () {

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/StTransaction/GetInvoiceDetailsById?id=" + id,
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
                    fK_StItemId: { editable: false },
                    fK_StGenderId: { editable: false },
                    fK_StBrandId: { editable: false },
                    fK_StModelId: { editable: false },
                    fK_StColorId: { editable: false },
                    fK_StSizeId: { editable: false },
                    fK_StUnitId: { editable: false },
                    itemBarcode: { validation: { required: true } },
                    itemName: { validation: { required: true, message: Resources.Required } },
                    quantityFrom: { type: "number", validation: { min: 0, required: true, message: Resources.Required } },
                    discount: { type: "number", editable: false },
                    unitPurchasePrice: { type: "number", editable: false },
                    unitSalesPrice: { type: "number" },
                    unitCostPrice: { type: "number", editable: false },
                    totalSalesPrice: { type: "string" },
                    expiryDate: { type: "date", validation: { required: true, message: Resources.Required } },
                }
            }
        },
    });

    var ApprovedDetail = $("#InvoiceDetailGrid").kendoGrid({
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
            { field: "fK_StItemId", hidden: true },
            { field: "FK_StGenderId", hidden: true },
            { field: "FK_StBrandId", hidden: true },
            { field: "FK_StModelId", hidden: true },
            { field: "FK_StColorId", hidden: true },
            { field: "FK_StSizeId", hidden: true },
            { field: "FK_StUnitId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "quantityFrom", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "discount", hidden: true },
            { field: "unitPurchasePrice", hidden: true },
            { field: "unitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "unitCostPrice", hidden: true },
            { field: "totalSalesPrice", title: Resources.Total, width: Resources.InputNumberWidth },

            //{ field: "totalSalsePrice", hidden: true },

            //{ field: "ItemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "expiryDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.DateExpiry },

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
    $("#InvoiceDetailGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

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

    $("#btnSaveTransaction").click(function () {
        if ($("#SerialNumber").val() > 0) {
            $("#SerialNumberValid").text("")
        } else {
            $("#SerialNumberValid").text(Resources.Required)
        }

        //if ($("#FK_StStoreToId").val() > 0) {
        //    $("#validStoreCode").text("")
        //} else {
        //    $("#validStoreCode").text(Resources.Required)
        //}
        saveReturnBill();
    })
    function saveReturnBill() {
        var table = [];
        var gridData = $("#InvoiceDetailGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            if (checkedIds[gridData[i].id]) {
                var row = {
                    FK_StItemId: gridData[i].fK_StItemId,
                    QuantityFrom: gridData[i].quantityFrom,
                    FK_StUnitId: gridData[i].fK_StUnitId,
                    FK_StBrandId: gridData[i].fK_StBrandId,
                    FK_StModelId: gridData[i].fK_StBrandId,
                    FK_StGenderId: gridData[i].fK_StGenderId,
                    FK_StColorId: gridData[i].fK_StColorId,
                    FK_StSizeId: gridData[i].fK_StSizeId,
                    UnitPurchasePrice: gridData[i].unitPurchasePrice,
                    UnitCostPrice: gridData[i].unitCostPrice,
                    UnitSalesPrice: gridData[i].unitSalesPrice,
                    TotalCostPrice: gridData[i].unitCostPrice * gridData[i].quantityFrom,
                    TotalSalesPrice: gridData[i].totalSalesPrice,
                    ReturnFromSerial: $("#returnedSerialhd").val().split("-")[1],
                    ReturnFromDate: $("#returnedBillDate").val(),
                    ReturnedId: gridData[i].id,

                }
                table.push(row);
            }
        }
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if ($("#formInvoiceReturn").valid() && $("#SerialNumber").val() > 0 && table.length > 0) {

            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                BookNumber: $("#returnedSerialhd").val().split("-")[1],
                BookNumberPrefix: $("#returnedSerialhd").val().split("-")[0] + "-",
                //FK_StStoreFromId: null,
                FK_StStoreToId: $("#FK_StStoreToId").val(),
                TransactionDate: $("#TransactionDate").val(),
                TotalItemCount: $("#TotalItemCount").val(),
                TotalSalesPrice: $("#TotalSalesPrice").val(),
                //hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: table
            }
            debugger
            $.ajax({
                url: '/StTransaction/CreateSellInvoich',
                type: 'POST',
                data: { addEditStSellInvoiceVM: tran },
                success: function (result) {

                    if (isNaN(result)) {
                        var message = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].quantityTo < result[i].quantityFrom)
                                message += Resources.MaxItemAllowedQuantity + " " + result[i].itemName + " ( " + result[i].quantityTo + " ) ";
                        }

                        swal({
                            title: message,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                    } else if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {
                                document.location = "../../StTransaction/Search"
                            }, 1000);
                        });

                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }

                }
            })
        }
    }
})

var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        thischk = this,
        row = $(this).closest("tr"),
        grid = $("#InvoiceDetailGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

        if (checked) {
            var quantity = 0;
            var table = $("#InvoiceDetailGrid").data("kendoGrid").dataSource.data();
            for (var i = 0; i < table.length; i++) {
                if (table[i].fK_StItemId == dataItem.fK_StItemId && checkedIds[table[i].id] == true)
                    quantity += parseFloat(table[i].quantityFrom);
            }

            checkedIds[dataItem.id] = checked;
            row.addClass("k-state-selected");
            var checkHeader = true;
            $.each(grid.items(), function (index, item) {
                if (!($(item).hasClass("k-state-selected"))) {
                    checkHeader = false;
                }
            });

            $("#header-chb")[0].checked = checkHeader;
            var gridData = $("#InvoiceDetailGrid").data("kendoGrid").dataSource._data;
            var quantity1 = 0;
            var total = 0;
            for (var i = 0; i < gridData.length; i++) {

                if (checkedIds[gridData[i].id]) {
                    quantity1 += parseFloat(gridData[i].quantityFrom);
                    total += parseFloat(gridData[i].totalSalesPrice);
                }
            }

            $("#TotalItemCount").val(quantity1);
            $("#TotalSalesPrice").val(total);
                    
            //-select the row

        } else {
            //-remove selection
            row.removeClass("k-state-selected");
            $("#header-chb")[0].checked = false;
            checkedIds[dataItem.id] = checked
            var gridData = $("#InvoiceDetailGrid").data("kendoGrid").dataSource._data;
            var quantity = 0;
            var total = 0;
            for (var i = 0; i < gridData.length; i++) {

                if (checkedIds[gridData[i].id]) {
                    quantity += parseFloat(gridData[i].quantityFrom);
                    total += parseFloat(gridData[i].totalSalesPrice);
                }
            }

            $("#TotalItemCount").val(quantity);
            $("#TotalSalesPrice").val(total);
        }

    

}
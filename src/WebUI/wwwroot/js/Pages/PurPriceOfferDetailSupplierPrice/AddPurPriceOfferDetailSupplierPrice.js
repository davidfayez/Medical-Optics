$(document).ready(function () {

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    //var fK_PaySupplierId = $("#FK_PaySupplierId").val();
    //var offerDetailsUrl = "/PurPriceOfferDetailSupplierPrice/GetPurOfferDetailSupplierPriceById?id=" + id + "&fK_PaySupplierId=" + fK_PaySupplierId;
    var offerDetailsUrl = "/PurPriceOffer/GetPurOfferDetailsById?id=" + id;
    loadPurPriceOfferDetailsSuppliersGrid();

    $("#FK_PaySupplierId").change(function () {
        debugger;
        if ($("#FK_PaySupplierId").val() > 0) {
            var fK_PaySupplierId = $("#FK_PaySupplierId").val();
            offerDetailsUrl = "/PurPriceOfferDetailSupplierPrice/GetPurOfferDetailSupplierPriceById?id=" + id + "&fK_PaySupplierId=" + fK_PaySupplierId;
            loadPurPriceOfferDetailsSuppliersGrid();
        }
        else {
            offerDetailsUrl = "/PurPriceOffer/GetPurOfferDetailsById?id=" + id;
            loadPurPriceOfferDetailsSuppliersGrid();

        }
    })

    function loadPurPriceOfferDetailsSuppliersGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: offerDetailsUrl,
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
                        fK_PurPriceOfferId: { editable: true },
                        fK_PurPriceOfferDetailId :{ editable: true },
                        fK_PurPriceOfferDetailSupplierPricId :{ editable: true },
                        fK_StItemId: { editable: false },
                        fK_StUnitId: { editable: false },
                        fK_StMainCategoryId: { editable: false },
                        itemBarcode: { editable: false },
                        itemName: { editable: false },
                        quantity: { editable: false },
                        price: { type: "number" },


                    }
                }
            },
        });


        var grid = $("#DetailSupplierPriceGrid").kendoGrid({
            dataSource: dataSource,
            navigatable: true,
            pageable: false,
            scrollable: false,
            columns: [

                { field: "fK_PurPriceOfferId", hidden: true },
                { field: "fK_PurPriceOfferDetailId", hidden: true },
                { field: "fK_PurPriceOfferDetailSupplierPricId", hidden: true },
                { field: "fK_StItemId", hidden: true },
                { field: "fK_StUnitId", hidden: true },
                { field: "fK_StMainCategoryId", hidden: true },
                { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
                { width: Resources.NoteWidth, template: "<input type='number' data-bind='value:price' />", headerTemplate: Resources.Price }


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                });
                debugger;
                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
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

    }
   
    var thisRow = "";

    //bind click event to the checkbox
    $("#DetailSupplierPriceGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

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

    $("#btnSave").click(function () {
        if ($("#FK_PaySupplierId").val() > 0)
            $("#FK_PaySupplierIdValid").text("")
        else
            $("#FK_PaySupplierIdValid").text(Resources.Required)

        var table = $("#DetailSupplierPriceGrid").data("kendoGrid").dataSource.data();
        var all = getAllData();
        var data = $("#DetailSupplierPriceGrid").data("kendoGrid").dataSource;
        debugger;
        //if (table.length == 0) {
        //    swal({
        //        title: Resources.GridLengthZeroResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //
        //}
        if ($("#FK_PaySupplierId").val() > 0) {
            var purPriceOfferDetailSupplierPrice = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    FK_PurPriceOfferDetailId: table[i].fK_PurPriceOfferDetailId,
                    FK_PurPriceOfferDetailSupplierPricId: table[i].fK_PurPriceOfferDetailSupplierPricId,
                    FK_PaySupplierId: $("#FK_PaySupplierId").val(),
                    Price: table[i].price,
                    FK_CreatorId: $("#FK_CreatorId").val(),
                }
                debugger
                purPriceOfferDetailSupplierPrice.push(detail);
            }
            debugger
            $.ajax({
                url: '/PurPriceOfferDetailSupplierPrice/Create',
                type: 'POST',
                data: { purPriceOfferDetailSupplierPriceVMs: purPriceOfferDetailSupplierPrice },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../PurPriceOffer/Index";
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
    })

    function getCheckedData() {
        debugger;
        var editedData = [];

        gridData = $("#DetailSupplierPriceGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            var expiryDate = new Date(gridData[i].expiryDate);
            var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);

            if (checkedIds[gridData[i].id]) {
                var row = {
                    Id: gridData[i].id,
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

        gridData = $("#DetailSupplierPriceGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {
            var expiryDate = new Date(gridData[i].expiryDate);
            var expiryDateFormated = expiryDate.getFullYear() + "-" + ("0" + (expiryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + expiryDate.getDate()).slice(-2);

            var row = {
                Id: gridData[i].id,
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
})

var checkedIds = {};

//on click of the checkbox:
function selectRow() {
    var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#DetailSupplierPriceGrid").data("kendoGrid"),
        dataItem = grid.dataItem(row);

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
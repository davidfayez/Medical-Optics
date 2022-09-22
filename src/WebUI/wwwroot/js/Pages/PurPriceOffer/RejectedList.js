$(document).ready(function () {

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);


    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PurPriceOffer/GetPurOfferDetailsById?id=" + id,
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
                    fK_StItemId: { editable: false },
                    fK_StUnitId: { editable: false },
                    fK_StMainCategoryId: { editable: false },
                    itemBarcode: { editable: false },
                    itemName: { editable: false },
                    quantity: { editable: false },

                }
            }
        },
    });

    var RejectedDetail = $("#RejectDetailGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            
            { field: "fK_PurPriceOfferId", hidden: true },
            { field: "fK_StItemId", hidden: true },
            { field: "fK_StUnitId", hidden: true },
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "itemBarcode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },

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
    var thisRow = "";

    //bind click event to the checkbox
    $("#RejectDetailGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

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

    $("#btnReject").bind("click", function () {

        var data = getCheckedData();
        if (data.length === 0) {
            data = getAllData();
        }
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

                var purPriceOffer = {
                    Id: id,
                    Description: $("#Description").val(),
                    details: data
                }
                $.ajax({
                    url: '/PurPriceOffer/Reject',
                    type: 'POST',
                    data: { purPriceOfferVM: purPriceOffer },
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.DoneResource + " " + Resources.Reject,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                window.location.href = '/StTransaction/IndexRejectedDetail';
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

        gridData = $("#RejectDetailGrid").data("kendoGrid").dataSource._data;
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

        gridData = $("#RejectDetailGrid").data("kendoGrid").dataSource._data;
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
        grid = $("#RejectDetailGrid").data("kendoGrid"),
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
$(document).ready(function () {

    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PurchaseOrder/GetDetailsById?id=" + $("#Id").val(),
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
                    fK_StMainCategoryId: { editable: false },
                    fK_StItemId: { editable: false },
                    fK_StUnitId: { editable: false },
                    fK_StStatusId: { editable: false },
                    itemCode: { type: "text", editable: false },
                    itemName: { type: "text", editable: false },
                    itemUnit: { type: "text", editable: false },
                    quantity: { type: "number", editable: false },

                }
            }
        }
    });

    var purOrderDetail = $("#approveDetailsPOGrid").kendoGrid({
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
            { field: "fK_StUnitId", hidden: true },
            { field: "fK_StStatusId", hidden: true },
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "itemCode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "itemUnit", title: Resources.Unit, width: Resources.NameWidth },
            { field: "quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
        ],
        editable: false,
        selectable: "multiple, cell",
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);

            });
            debugger
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
        }


    });

    $("#approveDetailsPOGrid").data("kendoGrid").table.on("click", ".row-checkbox", selectRow);

    var checkedIds = {};

    //on click of the checkbox:
    function selectRow() {
        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $("#approveDetailsPOGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

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

    $("#btnApprove").click(function () {
        debugger
        var approvedIds = getCheckedIds();
        if (approvedIds.length === 0) {
            approvedIds = getAllIds();
        }
        var id = $("#Id").val();
        if (id > 0 && approvedIds.length > 0) {
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

                    $.ajax({
                        url: '/PurchaseOrder/Approve',
                        type: 'POST',
                        data: { id: id, detailApprovedIds: approvedIds },
                        success: function (result) {
                            if (result) {
                                swal({
                                    title: Resources.DoneResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                });
                                document.location = "../../PurchaseOrder/Index";
                            } else {
                                swal({
                                    title: Resources.ErrorMsgResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                });
                            }
                        }
                    })

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

    $(".btnSaveToPurchasePrice").click(function () {
        debugger
        var ids = getCheckedIds();
        if (ids.length === 0) {
            ids = getAllIds();
        }
        var id = $("#Id").val();
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

                        document.location = "../../PurPriceOffer/Create?id=" + id + "&ids=" + ids;

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

    function getCheckedIds() {
        debugger;
        var selectedIds = [];

        gridData = $("#approveDetailsPOGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {

            if (checkedIds[gridData[i].id]) {

                selectedIds.push(gridData[i].id);
            }


        }
        return selectedIds;
    }

    function getAllIds() {
        debugger;
        var allIds = [];

        gridData = $("#approveDetailsPOGrid").data("kendoGrid").dataSource._data;
        for (var i = 0; i < gridData.length; i++) {

            allIds.push(gridData[i].id);
        }
        return allIds;
    }
})

